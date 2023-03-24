use super::types::*;
use crate::algorithm::types::IAlgoPiece;
use crate::loadout::{get_loadout_tuple, types::LoadoutType};
use crate::prisma::{self, loadout, unit, unit_skill, PrismaClient};
use crate::service::errors::{RequirementError, TauriError};
use crate::state::types::GrandResource;
use crate::traits::FromAsync;
use crate::unit::types::{Class, NeuralExpansion};
use crate::{stats::types::*, table::consts::*, unit::types::IUnit};
use prisma_client_rust::QueryError;
use std::str::FromStr;
use std::sync::Arc;

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
    pub async fn calculate(from_unit: &unit::Data) -> Result<Self, TauriError> {
        let unit = IUnit::from_async(from_unit.clone()).await;
        let unit_id = || from_unit.id.clone();
        let (current_lo, goal_lo) = get_loadout_tuple(from_unit.id.clone()).await.unwrap();
        let (neural_from, neural_to) = (
            NeuralExpansion::from_str(&current_lo.neural).unwrap(),
            NeuralExpansion::from_str(&goal_lo.neural).unwrap(),
        );
        let (current_sk, goal_sk) = (
            IUnitSkill::from_async(current_lo.skill_level().unwrap().unwrap().clone()).await,
            IUnitSkill::from_async(goal_lo.skill_level().unwrap().unwrap().clone()).await,
        );

        let neural = NeuralResourceRequirement::calculate_algorithm(
            neural_from,
            Some(neural_to),
            Some(NeuralFragment::new(current_lo.frags)),
            Some(unit_id()),
        )
        .await?;

        let skill = SkillResourceRequirement::calculate_algorithm(
            current_sk,
            Some(goal_sk),
            None,
            Some(unit_id()),
        )
        .await?;

        let level = LevelRequirement::calculate_algorithm(
            current_lo.level.try_into().unwrap(),
            Some(goal_lo.level.try_into().unwrap()),
            None,
            Some(unit_id()),
        )
        .await?;

        // TODO: refactor
        let breakthrough = WidgetResourceRequirement::calculate(
            unit.class,
            unit.current.level.0,
            unit.goal.level.0,
            Some(from_unit.id.clone()),
        )?;

        // TODO: refactor
        let algo = AlgorithmRequirement::calculate(&unit, Some(from_unit.id.clone())).await?;

        Ok(Self {
            unit_id: Some(from_unit.id.clone()),
            skill,
            neural,
            level,
            breakthrough,
            algo,
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
    pub async fn calculate(
        from_unit: &IUnit,
        from_unit_id: Option<String>,
    ) -> Result<Self, RequirementError<IAlgoPiece>> {
        // TODO: handle error
        Ok(Self {
            pieces: from_unit.get_missing_algos(),
            from_unit_id,
        })
    }

    pub(super) fn is_fulfilled(&self) -> bool {
        self.pieces
            .iter()
            .flat_map(|piece| piece.slot.0.clone())
            .all(|slot| slot.value)
    }
}

impl TRequirement for LevelRequirement {
    type Input = u32;
    type Output = LevelRequirement;
    type Contraints = ();
    type ErrorType = u32;
    type PrismaType = loadout::Data;

    fn choose_field(prisma_data: Self::PrismaType) -> Self::Input {
        prisma_data.level.try_into().unwrap()
    }

    async fn get_db_to(
        client: Arc<PrismaClient>,
        from: Self::PrismaType,
        next_loadout_type: LoadoutType,
    ) -> Result<Option<Self::PrismaType>, QueryError> {
        client
            .loadout()
            .find_first(vec![
                loadout::loadout_type::equals(next_loadout_type.to_string()),
                loadout::unit_id::equals(from.unit_id),
            ])
            .exec()
            .await
    }

    async fn calculate_algorithm(
        from: Self::Input,
        to: Option<Self::Input>,
        _: Option<Self::Contraints>,
        from_unit_id: Option<String>,
    ) -> Result<Self::Output, RequirementError<Self::ErrorType>> {
        let to = if let Some(value) = to {
            value
        } else {
            return Err(RequirementError::MissingCompareItem);
        };
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
                Ok(Self {
                    exp: Exp(total),
                    from_unit_id,
                })
            }
            std::cmp::Ordering::Equal => Ok(Self {
                exp: Default::default(),
                from_unit_id,
            }),
            std::cmp::Ordering::Greater => Err(RequirementError::FromTo(from, to)),
        }
    }
}

impl TRequirement for NeuralResourceRequirement {
    type Input = NeuralExpansion;
    type Output = NeuralResourceRequirement;
    type Contraints = NeuralFragment;
    type ErrorType = NeuralExpansion;
    type PrismaType = loadout::Data;

    fn choose_field(prisma_data: Self::PrismaType) -> Self::Input {
        Self::Input::from_str(&prisma_data.neural).unwrap()
    }

    async fn get_db_to(
        client: Arc<PrismaClient>,
        from: Self::PrismaType,
        next_loadout_type: LoadoutType,
    ) -> Result<Option<Self::PrismaType>, QueryError> {
        client
            .loadout()
            .find_first(vec![
                loadout::loadout_type::equals(next_loadout_type.to_string()),
                loadout::unit_id::equals(from.unit_id),
            ])
            .exec()
            .await
    }

    async fn calculate_algorithm(
        from: Self::Input,
        to: Option<Self::Input>,
        extra_constraints: Option<Self::Contraints>,
        from_unit_id: Option<String>,
    ) -> Result<Self::Output, RequirementError<Self::ErrorType>> {
        let to = if let Some(value) = to {
            value
        } else {
            return Err(RequirementError::MissingCompareItem);
        };
        let current = extra_constraints.unwrap_or(Self::Contraints::default());
        match from.cmp(&to) {
            std::cmp::Ordering::Less => {
                let sum_coin = &REQ_NEURAL_COIN[from as usize + 1..to as usize + 1];
                Ok(NeuralResourceRequirement {
                    frags: Self::get_frags(current, from, to),
                    coin: Coin(sum_coin.iter().sum::<u32>()),
                    kits: Self::calculate_kits_conversion(current, from, to).unwrap(),
                    from_unit_id,
                })
            }
            std::cmp::Ordering::Equal => Ok(NeuralResourceRequirement::default()),
            std::cmp::Ordering::Greater => Err(RequirementError::FromTo(from, to)),
        }
    }
}

impl NeuralResourceRequirement {
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

impl TRequirement for SkillResourceRequirement {
    type Input = IUnitSkill;
    type Output = SkillResourceRequirement;
    type Contraints = ();
    type ErrorType = IUnitSkill;
    type PrismaType = unit_skill::Data;

    fn choose_field(prisma_data: Self::PrismaType) -> Self::Input {
        IUnitSkill {
            passive: prisma_data.passive as u32,
            auto: prisma_data.auto as u32,
        }
    }

    // WARN: untested
    async fn get_db_to(
        client: Arc<PrismaClient>,
        from: Self::PrismaType,
        next_loadout_type: LoadoutType,
    ) -> Result<Option<Self::PrismaType>, QueryError> {
        let owner_unit_id = client
            .unit()
            .find_first(vec![unit::loadouts::some(vec![loadout::id::equals(
                from.loadout_id,
            )])])
            .exec()
            .await?
            .unwrap()
            .id;
        client
            .unit_skill()
            .find_first(vec![unit_skill::loadout::is(vec![
                loadout::loadout_type::equals(next_loadout_type.to_string()),
                loadout::unit::is(vec![unit::id::equals(owner_unit_id)]),
            ])])
            .exec()
            .await
    }

    async fn calculate_algorithm(
        from: Self::Input,
        to: Option<Self::Input>,
        extra_constraints: Option<Self::Contraints>,
        from_unit_id: Option<String>,
    ) -> Result<Self::Output, RequirementError<Self::ErrorType>> {
        /// returns needed resource for passive skill and auto skill from a range of slv
        fn slice_sum(mut vector: Vec<u32>, from: IUnitSkill, to: IUnitSkill) -> u32 {
            let v_passive: Vec<u32> = vector
                .clone()
                .drain(from.passive as usize..to.passive as usize)
                .collect();
            let v_auto: Vec<u32> = vector.drain(from.auto as usize..to.auto as usize).collect();
            v_passive.iter().sum::<u32>() + v_auto.iter().sum::<u32>()
        }
        let to = if let Some(value) = to {
            value
        } else {
            return Err(RequirementError::MissingCompareItem);
        };
        let mut data: Vec<u32> = Vec::new();
        // NOTE: double check with index in return struct
        let attrs = vec![REQ_SLV_TOKEN, REQ_SLV_PIVOT, REQ_SLV_COIN];
        for attr in attrs.iter() {
            data.push(slice_sum(attr.to_vec(), from, to))
        }

        Ok(Self {
            token: data[0],
            pivot: data[1],
            coin: Coin(data[2]),
            from_unit_id,
        })
    }
}

impl SkillResourceRequirement {
    pub(super) fn calculate(
        from: IUnitSkill,
        to: IUnitSkill,
        from_unit_id: Option<String>,
    ) -> Self {
        /// returns needed resource for passive skill and auto skill from a range of slv
        fn slice_sum(mut vector: Vec<u32>, from: IUnitSkill, to: IUnitSkill) -> u32 {
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
            from_unit_id,
        }
    }
}

impl WidgetResourceRequirement {
    /// from, to are levels, LB stages are automatically converted
    pub fn calculate(
        class: Class,
        from: u32,
        to: u32,
        from_unit_id: Option<String>,
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
                    from_unit_id,
                })
            }
            std::cmp::Ordering::Equal => Ok(WidgetResourceRequirement::default()),
            std::cmp::Ordering::Greater => Err(RequirementError::FromTo(from, to)),
        }
    }
}
