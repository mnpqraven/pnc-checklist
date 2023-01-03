use crate::model::{infomodel::UnitSkill, tables::*};
use serde::{Deserialize, Serialize};
use std::fmt::Display;

/// Tokens and pivots a unit would need to max out its skill
#[derive(Serialize, Deserialize, Debug)]
pub struct SkillResourceRequirement {
    pub token: u32,
    pub pivot: u32,
    pub coin: u32,
}

impl Display for SkillResourceRequirement {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "Unit needs {} tokens, {} pivots and {} DGC Coin",
            self.token, self.pivot, self.coin
        )
    }
}

/// calculates total tokens + pivots needed for a unit
///
/// * `current_slv`: unit's current slv
#[tauri::command]
pub fn requirement_slv(current_slv: UnitSkill, target_slv: UnitSkill) -> SkillResourceRequirement {
    /// returns needed resource for passive skill and auto skill from a range of slv
    fn slice_sum(mut vector: Vec<u32>, from: UnitSkill, to: UnitSkill) -> u32 {
        let v_passive: Vec<u32> = vector
            .clone()
            .drain(from.passive as usize..to.passive as usize)
            .collect();
        let v_auto: Vec<u32> = vector
            .drain(from.auto as usize..to.auto as usize)
            .collect();
        v_passive.iter().sum::<u32>() + v_auto.iter().sum::<u32>()
    }
    let mut data: Vec<u32> = Vec::new();
    // NOTE: double check with index in return struct
    let attrs = vec![SLV_TOKEN, SLV_PIVOT, SLV_COIN];
    for attr in attrs.iter() {
        data.push(slice_sum(attr.to_vec(), current_slv, target_slv))
    }

    SkillResourceRequirement {
        token: data[0],
        pivot: data[1],
        coin: data[2],
    }
}

/// struct for the requirement screen, gathers all requirements needed, single
///  requirement can be accessed by fields
/// SoSoA
pub struct DatabaseRequirement {
    pub unit_req: Vec<UnitRequirement>,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct GrandResource {
    pub slv_token: u32,
    pub slv_pivot: u32,
    pub coin: u32,
    // TODO: widgets struct
    // exp
    // neural kits
    // rolls ?
}
/// struct for single unit
pub struct UnitRequirement {
    pub skill: SkillResourceRequirement,
    // neural: NeuralResourceRequirement
    // exp: Exp
    // TODO: AlgorithmRequirement, compare goal with current and generate
    // missing algos from current
}

#[cfg(test)]
mod tests {
    use super::requirement_slv;
    use crate::model::infomodel::UnitSkill;

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
    fn test_display() {
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
        println!("{}", calc);
    }
}
