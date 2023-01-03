use std::fmt::Display;

use crate::model::{
    infomodel::{Class, Coin, SkillCurrency, UnitSkill},
    tables::{REQ_EXP_CHAIN, REQ_NEURAL, REQ_SLV_COIN, REQ_SLV_PIVOT, REQ_SLV_TOKEN},
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub enum RequirementError<T> {
    OutOfBound(T),
    FromTo(T, T),
}

impl<T: Display> Display for RequirementError<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let err = match self {
            RequirementError::OutOfBound(t) => {
                format!("Element {t} is out of range that can be calculated")
            }
            RequirementError::FromTo(a, b) => format!("{a} is bigger than {b}"),
        };
        write!(f, "{}", err)
    }
}
/// Tokens and pivots a unit would need to max out its skill
#[derive(Serialize, Deserialize, Debug)]
pub struct SkillResourceRequirement {
    pub token: u32,
    pub pivot: u32,
    pub coin: u32,
}

/// struct for the requirement screen, gathers all requirements needed, single
///  requirement can be accessed by fields
/// SoSoA
pub struct DatabaseRequirement {
    pub unit_req: Vec<UnitRequirement>,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct Exp(pub u32);
#[derive(Debug, Serialize, Deserialize, Default)]
pub struct GrandResource {
    pub skill: SkillCurrency,
    pub coin: Coin,
    pub widgets: Vec<WidgetResource>,
    pub exp: Exp,
    pub neural_kits: u32,
    // rolls ?
}
#[derive(Debug, Serialize, Deserialize, Default)]
pub struct WidgetResource {
    class: Class,
    widget_inventory: [u32; 6],
}

/// struct for single unit
pub struct UnitRequirement {
    pub skill: SkillResourceRequirement,
    pub neural: NeuralResourceRequirement,
    pub level: LevelRequirement,
    pub breakthrough: WidgetResourceRequirement,
    // TODO: AlgorithmRequirement, compare goal with current and generate
    // missing algos from current
}
#[derive(Debug, Serialize, Deserialize, Default)]
pub struct LevelRequirement {
    pub exp: Exp,
}
impl LevelRequirement {
    fn calculate(from: u32, to: u32) -> Result<Self, RequirementError<u32>> {
        match &from.cmp(&to) {
            std::cmp::Ordering::Less => {
                let (from_ind, to_ind) = ((&from / 10) as usize, (&to / 10) as usize);
                let mut middle = 0;
                if &to / 10 - &from / 10 > 1 {
                    for item in REQ_EXP_CHAIN[from_ind + 1..to_ind].iter() {
                        middle += item.into_iter().sum::<u32>();
                    }
                }

                let (_, from_right) = REQ_EXP_CHAIN[from_ind].split_at((&from % 10) as usize);
                let (to_left, _) = REQ_EXP_CHAIN[to_ind].split_at((&to % 10) as usize);

                let total: u32 =
                    from_right.into_iter().sum::<u32>() + middle + to_left.into_iter().sum::<u32>();
                Ok(Self { exp: Exp(total) })
            }
            std::cmp::Ordering::Equal => Ok(Self::default()),
            std::cmp::Ordering::Greater => Err(RequirementError::FromTo(from, to)),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct WidgetResourceRequirement {
    pub widget_inventory: [u32; 6],
    pub coin: Coin,
}
#[derive(Debug, Serialize, Deserialize, Default)]
pub struct NeuralResourceRequirement(pub u32);

#[allow(dead_code)]
#[derive(Serialize, Deserialize)]
pub enum NeuralExpansion {
    One,
    OneHalf,
    Two,
    TwoHalf,
    Three,
    ThreeHalf,
    Four,
    FourHalf,
    Five,
}
impl NeuralResourceRequirement {
    fn calculate(
        from: NeuralExpansion,
        to: NeuralExpansion,
    ) -> Result<NeuralResourceRequirement, RequirementError<u32>> {
        let sum = &REQ_NEURAL[from as usize + 1..to as usize + 1];
        Ok(NeuralResourceRequirement(sum.into_iter().sum::<u32>()))
    }

    // TODO:
    fn calculate_kits(bought: Option<u32>, from: NeuralExpansion, to: NeuralExpansion) -> Result<NeuralResourceRequirement, RequirementError<u32>> {
        NeuralResourceRequirement::calculate(from, to)?;
        unimplemented!()
    }
}
impl SkillResourceRequirement {
    fn calculate(from: UnitSkill, to: UnitSkill) -> Self {
        /// returns needed resource for passive skill and auto skill from a range of slv
        fn slice_sum(mut vector: Vec<u32>, from: UnitSkill, to: UnitSkill) -> u32 {
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
            coin: data[2],
        }
    }
}

/// calculates total tokens + pivots needed for a unit
///
/// * `current_slv`: unit's current slv
#[tauri::command]
pub fn requirement_slv(current_slv: UnitSkill, target_slv: UnitSkill) -> SkillResourceRequirement {
    SkillResourceRequirement::calculate(current_slv, target_slv)
}
#[tauri::command]
pub fn requirement_level(from: u32, to: u32) -> Result<LevelRequirement, RequirementError<u32>> {
    LevelRequirement::calculate(from, to)
}
#[tauri::command]
pub fn requirement_neural(from: NeuralExpansion, to: NeuralExpansion) -> Result<NeuralResourceRequirement, RequirementError<u32>>{
    NeuralResourceRequirement::calculate(from, to)
}

#[cfg(test)]
mod tests {
    use crate::{
        model::infomodel::UnitSkill,
        parser::requirement::{requirement_slv, LevelRequirement},
    };

    use super::{NeuralExpansion, NeuralResourceRequirement};

    #[test]
    fn test_skill_total() {
        let unit_skill = UnitSkill {
            passive: 5,
            auto: 8,
        };
        let calc = requirement_slv(
            unit_skill,
            UnitSkill {
                passive: 10,
                auto: 10,
            },
        );
        assert_eq!(calc.token, 16680);
        assert_eq!(calc.pivot, 44);
    }
    #[test]
    fn test_skill_halfway() {
        let unit_skill = UnitSkill {
            passive: 5,
            auto: 8,
        };
        let calc = requirement_slv(
            unit_skill,
            UnitSkill {
                passive: 9,
                auto: 9,
            },
        );
        assert_eq!(calc.pivot, 20);
    }

    #[test]
    fn levelreq() {
        assert_eq!(43 / 10, 4);
        assert_eq!(LevelRequirement::calculate(29, 30).unwrap().exp.0, 2190);
        assert_eq!(
            LevelRequirement::calculate(29, 31).unwrap().exp.0,
            2190 + 2450
        );
        assert_eq!(
            LevelRequirement::calculate(29, 41).unwrap().exp.0,
            2190 + 30410 + 3990
        );
        assert_eq!(
            LevelRequirement::calculate(27, 62).unwrap().exp.0,
            1540 + 1930 + 2190 + 30410 + 54390 + 105490 + 17000 + 22000
        );
    }
    #[test]
    fn neuralreq() {
        assert_eq!(
            NeuralResourceRequirement::calculate(NeuralExpansion::One, NeuralExpansion::Five)
                .unwrap()
                .0,
            400
        );
        assert_eq!(
            NeuralResourceRequirement::calculate(NeuralExpansion::Three, NeuralExpansion::Five)
                .unwrap()
                .0,
            320
        );
        assert_eq!(
            NeuralResourceRequirement::calculate(NeuralExpansion::Two, NeuralExpansion::FourHalf)
                .unwrap()
                .0,
            25 + 40 + 60 + 70 + 90
        )
    }
}
