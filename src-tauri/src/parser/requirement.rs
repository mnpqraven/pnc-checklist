use crate::model::{
    error::RequirementError,
    infomodel::{Class, Coin, SkillCurrency, Unit, UnitSkill},
    tables::{
        REQ_BREAK_CHAIN, REQ_EXP_CHAIN, REQ_NEURAL, REQ_NEURAL_COIN, REQ_SLV_COIN, REQ_SLV_PIVOT,
        REQ_SLV_TOKEN,
    },
};
use serde::{Deserialize, Serialize};

/// Tokens and pivots a unit would need to max out its skill
#[derive(Serialize, Deserialize, Debug)]
pub struct SkillResourceRequirement {
    pub token: u32,
    pub pivot: u32,
    pub coin: Coin,
}

/// struct for the requirement screen, gathers all requirements needed, single
///  requirement can be accessed by fields
/// SoSoA
#[derive(Debug)]
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
pub struct WidgetResourceRequirement {
    pub widget: WidgetResource,
    pub coin: Coin,
}
#[derive(Debug, Serialize, Deserialize, Default)]
pub struct NeuralResourceRequirement {
    pub frags: u32,
    pub coin: Coin,
}

#[derive(Debug, Serialize, Deserialize, Copy, Clone)]
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
#[derive(Debug, Serialize, Deserialize, Default)]
pub struct WidgetResource {
    class: Class,
    widget_inventory: [u32; 6],
}

/// struct for single unit
#[derive(Debug)]
pub struct UnitRequirement {
    pub skill: SkillResourceRequirement,
    pub neural: NeuralResourceRequirement,
    pub level: LevelRequirement,
    pub breakthrough: WidgetResourceRequirement,
    // TODO: AlgorithmRequirement, compare goal with current and generate
    // missing algos from current
}
impl UnitRequirement {
    pub fn update_unit_req(unit: &Unit) -> Self {
        Self {
            skill: SkillResourceRequirement::calculate(
                unit.current.skill_level,
                unit.goal.skill_level,
            ),
            neural: NeuralResourceRequirement::calculate(
                Some(unit.current.frags),
                unit.current.neural,
                unit.goal.neural,
            )
            .unwrap(),
            level: LevelRequirement::calculate(unit.current.level.0, unit.goal.level.0).unwrap(),
            breakthrough: WidgetResourceRequirement::calculate(
                unit.class,
                unit.current.level.0,
                unit.goal.level.0,
            )
            .unwrap(),
        }
    }
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
                        middle += item.iter().sum::<u32>();
                    }
                }

                let (_, from_right) = REQ_EXP_CHAIN[from_ind].split_at((&from % 10) as usize);
                let (to_left, _) = REQ_EXP_CHAIN[to_ind].split_at((&to % 10) as usize);

                let total: u32 =
                    from_right.iter().sum::<u32>() + middle + to_left.iter().sum::<u32>();
                Ok(Self { exp: Exp(total) })
            }
            std::cmp::Ordering::Equal => Ok(Self::default()),
            std::cmp::Ordering::Greater => Err(RequirementError::FromTo(from, to)),
        }
    }
}

impl NeuralResourceRequirement {
    fn calculate(
        current: Option<u32>,
        from: NeuralExpansion,
        to: NeuralExpansion,
    ) -> Result<NeuralResourceRequirement, RequirementError<u32>> {
        let sum = &REQ_NEURAL[from as usize + 1..to as usize + 1];
        let sum_coin = &REQ_NEURAL_COIN[from as usize + 1..to as usize + 1];
        Ok(NeuralResourceRequirement {
            frags: sum.iter().sum::<u32>() - current.unwrap_or(0),
            coin: Coin(sum_coin.iter().sum::<u32>()),
        })
    }

    // TODO:
    fn calculate_kits_conversion(
        current: Option<u32>,
        from: NeuralExpansion,
        to: NeuralExpansion,
    ) -> Result<u32, RequirementError<u32>> {
        let frags = NeuralResourceRequirement::calculate(current, from, to)?.frags;
        println!("{:?}", frags);
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
            coin: Coin(data[2]),
        }
    }
}

impl WidgetResourceRequirement {
    /// from, to are levels, LB stages are automatically converted
    fn calculate(
        class: Class,
        from: u32,
        to: u32,
    ) -> Result<WidgetResourceRequirement, RequirementError<u32>> {
        let (from_ind, mut to_ind) = ((&from / 10) as usize, (&to / 10) as usize);
        match &from_ind.cmp(&to_ind) {
            std::cmp::Ordering::Less => {
                let mut total: [u32; 7] = [0; 7];
                if to_ind == 1 {
                    // first breakthrough starts at 10 not 0, make iter loop twice
                    to_ind += 1;
                }
                for stage in REQ_BREAK_CHAIN[from_ind..to_ind].iter() {
                    dbg!(stage);
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
pub fn requirement_neural(
    current: Option<u32>,
    from: NeuralExpansion,
    to: NeuralExpansion,
) -> Result<NeuralResourceRequirement, RequirementError<u32>> {
    NeuralResourceRequirement::calculate(current, from, to)
}
#[tauri::command]
pub fn requirment_neural_kits(
    current: Option<u32>,
    from: NeuralExpansion,
    to: NeuralExpansion,
) -> Result<u32, RequirementError<u32>> {
    NeuralResourceRequirement::calculate_kits_conversion(current, from, to)
}
#[tauri::command]
pub fn requirement_widget(
    class: Class,
    from: u32,
    to: u32,
) -> Result<WidgetResourceRequirement, RequirementError<u32>> {
    WidgetResourceRequirement::calculate(class, from, to)
}

#[cfg(test)]
mod tests {
    use crate::{
        model::infomodel::{Class, UnitSkill},
        parser::requirement::{requirement_slv, LevelRequirement},
    };

    use super::{NeuralExpansion, NeuralResourceRequirement, WidgetResourceRequirement};

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
            NeuralResourceRequirement::calculate(
                Some(0),
                NeuralExpansion::One,
                NeuralExpansion::Five
            )
            .unwrap()
            .frags,
            400
        );
        assert_eq!(
            NeuralResourceRequirement::calculate(
                Some(0),
                NeuralExpansion::Three,
                NeuralExpansion::Five
            )
            .unwrap()
            .frags,
            320
        );
        assert_eq!(
            NeuralResourceRequirement::calculate(
                Some(0),
                NeuralExpansion::Two,
                NeuralExpansion::FourHalf
            )
            .unwrap()
            .frags,
            25 + 40 + 60 + 70 + 90
        )
    }
    #[test]
    fn widget_1() {
        assert_eq!(
            WidgetResourceRequirement::calculate(Class::Guard, 1, 11)
                .unwrap()
                .coin
                .0,
            500
        );
        assert_eq!(
            WidgetResourceRequirement::calculate(Class::Guard, 1, 11)
                .unwrap()
                .widget
                .widget_inventory,
            [10, 0, 0, 0, 0, 0]
        );
    }
    #[test]
    fn widget_2() {
        assert_eq!(
            WidgetResourceRequirement::calculate(Class::Guard, 1, 70)
                .unwrap()
                .coin
                .0,
            7500 + 150000
        );
        assert_eq!(
            WidgetResourceRequirement::calculate(Class::Guard, 1, 70)
                .unwrap()
                .widget
                .widget_inventory,
            [20, 30, 35, 45, 55, 35]
        );
    }
    #[test]
    fn widget_3() {
        assert_eq!(
            WidgetResourceRequirement::calculate(Class::Guard, 19, 40)
                .unwrap()
                .coin
                .0,
            17000
        );
        assert_eq!(
            WidgetResourceRequirement::calculate(Class::Guard, 19, 40)
                .unwrap()
                .widget
                .widget_inventory,
            [10, 30, 35, 25, 0, 0]
        );
    }
    #[test]
    fn widget_4() {
        assert_eq!(
            WidgetResourceRequirement::calculate(Class::Guard, 19, 39)
                .unwrap()
                .coin
                .0,
            7000
        );
        assert_eq!(
            WidgetResourceRequirement::calculate(Class::Guard, 19, 39)
                .unwrap()
                .widget
                .widget_inventory,
            [10, 30, 20, 0, 0, 0]
        );
    }
    #[test]
    fn widget_5() {
        assert_eq!(
            WidgetResourceRequirement::calculate(Class::Guard, 21, 28)
                .unwrap()
                .coin
                .0,
            0
        );
        assert_eq!(
            WidgetResourceRequirement::calculate(Class::Guard, 21, 28)
                .unwrap()
                .widget
                .widget_inventory,
            [0, 0, 0, 0, 0, 0]
        );
    }
    #[test]
    fn kits_conversion() {
        let t = NeuralResourceRequirement::calculate_kits_conversion(
            None,
            NeuralExpansion::Three,
            NeuralExpansion::Five,
        )
        .unwrap();
        // 320
        let a = 25 * (5 + 10 + 15 + 20);
        let b = (320 - 100) * 25;
        assert_eq!(t, a + b);
    }
    #[test]
    fn kits_2() {
        let t = NeuralResourceRequirement::calculate_kits_conversion(
            Some(10),
            NeuralExpansion::Four,
            NeuralExpansion::Five,
        )
        .unwrap();
        // 90 + 100 - 10 = 180
        let a = 25 * (5 + 10 + 15 + 20); // 100
        let b = 25 * 80;
        assert_eq!(t, a + b);
    }
}
