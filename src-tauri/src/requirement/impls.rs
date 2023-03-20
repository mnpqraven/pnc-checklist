use std::str::FromStr;

use super::types::*;
use crate::algorithm::types::IAlgoPiece;
use crate::loadout::loadout_tuple_by_unit_id;
use crate::prisma::unit_skill;
use crate::service::db::get_db;
use crate::service::errors::{RequirementError, TauriError};
use crate::state::types::GrandResource;
use crate::unit::types::{Class, NeuralExpansion};
use crate::{stats::types::*, table::consts::*, unit::types::IUnit};

impl DatabaseRequirement {
    /// generate total resouces required from `DatabaseRequirement`
    pub fn generate_resource(&self) -> GrandResource {
        let mut sum = GrandResource::default();
        for unit in &self.unit_req {
            sum.combine(unit.get_req());
        }
        sum
    }
}
impl UnitRequirement {
    pub async fn update_unit_req(unit: &IUnit, temp_unit_id: String) -> Result<Self, TauriError> {
        let client = get_db().await;
        let (current_lo, goal_lo) = loadout_tuple_by_unit_id(temp_unit_id).await.unwrap();
        Ok(Self {
            skill: SkillResourceRequirement::calculate(
                current_lo.skill_level().unwrap().unwrap(),
                goal_lo.skill_level().unwrap().unwrap()
            ),
            neural: NeuralResourceRequirement::calculate(
                NeuralFragment::new(current_lo.frags),
                NeuralExpansion::from_str(&current_lo.neural).unwrap(),
                NeuralExpansion::from_str(&goal_lo.neural).unwrap(),
            )
            .unwrap(),
            level: LevelRequirement::calculate(unit.current.level.0, unit.goal.level.0).unwrap(),
            breakthrough: WidgetResourceRequirement::calculate(
                unit.class,
                unit.current.level.0,
                unit.goal.level.0,
            )
            .unwrap(),
            algo: AlgorithmRequirement::calculate(unit).unwrap(),
        })
    }

    pub fn get_req(&self) -> GrandResource {
        let skill = SkillCurrency {
            token: self.skill.token,
            pivot: self.skill.pivot,
        };
        let coin = self.breakthrough.coin.0 + self.neural.coin.0 + self.skill.coin.0;
        GrandResource {
            skill,
            coin: Coin(coin),
            widgets: vec![self.breakthrough.widget],
            exp: self.level.exp,
            neural_kits: self.neural.kits, // neural_kits: self.neural.frags,
        }
    }
}

impl AlgorithmRequirement {
    pub fn calculate(from_unit: &IUnit) -> Result<Self, RequirementError<IAlgoPiece>> {
        // TODO: handle error
        Ok(Self {
            pieces: from_unit.get_missing_algos(),
            from_unit: from_unit.clone(),
        })
    }

    pub(super) fn is_fulfilled(&self) -> bool {
        self.pieces
            .iter()
            .flat_map(|piece| piece.slot.0.clone())
            .all(|slot| slot.value)
    }
}

impl LevelRequirement {
    pub(super) fn calculate(from: u32, to: u32) -> Result<Self, RequirementError<u32>> {
        match &from.cmp(&to) {
            std::cmp::Ordering::Less => {
                let (from_ind, to_ind) = ((&from / 10) as usize, (&to / 10) as usize);
                let mut middle = 0;
                if &to / 10 - &from / 10 > 1 {
                    for item in REQ_EXP_CHAIN[from_ind + 1..to_ind].iter() {
                        middle += item.iter().sum::<u32>();
                    }
                }

                let (_, from_right) = REQ_EXP_CHAIN[from_ind].split_at((&from % 10) as usize);
                // fallback case last index
                let (mut to_left, _): (&[u32], &[u32]) = (&[0; 10], &[0]);
                if to_ind < REQ_EXP_CHAIN.len() {
                    (to_left, _) = REQ_EXP_CHAIN[to_ind].split_at((&to % 10) as usize);
                }

                let total: u32 =
                    from_right.iter().sum::<u32>() + middle + to_left.iter().sum::<u32>();
                Ok(Self { exp: Exp(total) })
            }
            std::cmp::Ordering::Equal => Ok(Self::default()),
            std::cmp::Ordering::Greater => {
                // TODO: handle
                // Err(RequirementError::FromTo(from, to))
                Ok(Self::default())
            }
        }
    }
}

impl NeuralResourceRequirement {
    pub fn calculate(
        current: NeuralFragment,
        from: NeuralExpansion,
        to: NeuralExpansion,
    ) -> Result<NeuralResourceRequirement, RequirementError<u32>> {
        match (from as usize).cmp(&(to as usize)) {
            std::cmp::Ordering::Less => {
                let sum_coin = &REQ_NEURAL_COIN[from as usize + 1..to as usize + 1];
                Ok(NeuralResourceRequirement {
                    frags: Self::get_frags(current, from, to),
                    coin: Coin(sum_coin.iter().sum::<u32>()),
                    kits: Self::calculate_kits_conversion(current, from, to).unwrap(),
                })
            }
            // TODO: handle
            _ => Ok(NeuralResourceRequirement::default()),
        }
    }

    fn get_frags(
        current: NeuralFragment,
        from: NeuralExpansion,
        to: NeuralExpansion,
    ) -> NeuralFragment {
        let sum = &REQ_NEURAL[from as usize + 1..to as usize + 1];
        NeuralFragment(Some(sum.iter().sum::<u32>() - current.0.unwrap_or(0)))
    }

    pub fn calculate_kits_conversion(
        current: NeuralFragment,
        from: NeuralExpansion,
        to: NeuralExpansion,
    ) -> Result<u32, RequirementError<NeuralFragment>> {
        let frags = NeuralResourceRequirement::get_frags(current, from, to);
        println!("{:?}", frags);
        match frags.0 {
            Some(frags) => {
                // increases by 5 every 25 uses, cap 25
                let (mut kits_cost, mut kits_req) = (5, 0);
                for i in 1..=frags {
                    kits_req += kits_cost;
                    if i % 25 == 0 && kits_cost < 25 {
                        kits_cost += 5;
                    }
                }
                Ok(kits_req)
            }
            None => Err(RequirementError::None(frags)),
        }
    }
}
impl SkillResourceRequirement {
    pub(super) fn calculate(from: &unit_skill::Data, to: &unit_skill::Data) -> Self {
        /// returns needed resource for passive skill and auto skill from a range of slv
        fn slice_sum(mut vector: Vec<u32>, from: &unit_skill::Data, to: &unit_skill::Data) -> u32 {
            let v_passive: Vec<u32> = vector
                .clone()
                .drain(from.passive as usize..to.passive as usize)
                .collect();
            let v_auto: Vec<u32> = vector.drain(from.auto as usize..to.auto as usize).collect();
            v_passive.iter().sum::<u32>() + v_auto.iter().sum::<u32>()
        }
        let mut data: Vec<u32> = Vec::new();
        // NOTE: double check with index in return struct
        let attrs = vec![REQ_SLV_TOKEN, REQ_SLV_PIVOT, REQ_SLV_COIN];
        for attr in attrs.iter() {
            data.push(slice_sum(attr.to_vec(), from, to))
        }

        Self {
            token: data[0],
            pivot: data[1],
            coin: Coin(data[2]),
        }
    }
}

impl WidgetResourceRequirement {
    /// from, to are levels, LB stages are automatically converted
    pub fn calculate(
        class: Class,
        from: u32,
        to: u32,
    ) -> Result<WidgetResourceRequirement, RequirementError<u32>> {
        let (mut from_ind, mut to_ind) = ((&from / 10) as usize, (&to / 10) as usize);
        match &from_ind.cmp(&to_ind) {
            std::cmp::Ordering::Less => {
                // offset for lv 1-10
                if from % 10 != 0 && from > 10 {
                    from_ind += 1;
                }
                // offset for maxlevel not triggering another iteration
                if to_ind >= REQ_BREAK_CHAIN.len() {
                    to_ind = REQ_BREAK_CHAIN.len() - 1;
                }

                let mut total: [u32; 7] = [0; 7];
                for stage in REQ_BREAK_CHAIN[from_ind..=to_ind].iter() {
                    // individual [u32; 7]
                    for (index, item) in stage.iter().enumerate() {
                        total[index] += item;
                    }
                }
                let (widget_inventory, coin) = total.split_at(6);
                Ok(WidgetResourceRequirement {
                    widget: WidgetResource {
                        class,
                        widget_inventory: widget_inventory.try_into().unwrap(),
                    },
                    coin: Coin(coin[0]),
                })
            }
            std::cmp::Ordering::Equal => Ok(WidgetResourceRequirement::default()),
            std::cmp::Ordering::Greater => Err(RequirementError::FromTo(from, to)),
        }
    }
}
