pub use super::enums::*;
use super::structs::*;
use super::tables::{ALGO_OFFENSE, ALGO_SPECIAL, ALGO_STABILITY, BONUS_TABLE};
use crate::requirement_slv;
use crate::state::Computed;
use strum::IntoEnumIterator;
use tauri::State;

impl Algorithm {
    pub fn all_gen1() -> Vec<Algorithm> {
        vec![
            Algorithm::LowerLimit,
            Algorithm::Feedforward,
            Algorithm::Deduction,
            Algorithm::Progression,
            Algorithm::DataRepair,
            Algorithm::MLRMatrix,
            Algorithm::Encapsulate,
            Algorithm::Iteration,
            Algorithm::Perception,
            Algorithm::Overflow,
            Algorithm::Rationality,
            Algorithm::Convolution,
            Algorithm::Inspiration,
            Algorithm::LoopGain,
            Algorithm::SVM,
            Algorithm::Paradigm,
            Algorithm::DeltaV,
            Algorithm::Cluster,
            Algorithm::Stratagem,
        ]
    }
    pub fn all_gen2() -> Vec<Algorithm> {
        vec![
            Algorithm::Stack,
            Algorithm::LimitValue,
            Algorithm::Reflection,
            Algorithm::Resolve,
            Algorithm::Exploit,
        ]
    }
    pub fn all() -> Vec<Algorithm> {
        Algorithm::all_gen1()
            .into_iter()
            .chain(Algorithm::all_gen2().into_iter())
            .collect()
    }
    pub fn get_bonuses(day: Day) -> Option<Vec<Algorithm>> {
        match day {
            Day::Mon => Some(vec![
                Algorithm::Encapsulate,
                Algorithm::Iteration,
                Algorithm::Perception,
                Algorithm::Inspiration,
                Algorithm::Stack,
            ]),
            Day::Tue => Some(vec![
                Algorithm::LowerLimit,
                Algorithm::Feedforward,
                Algorithm::Overflow,
                Algorithm::Rationality,
                Algorithm::LimitValue,
            ]),
            Day::Wed => Some(vec![
                Algorithm::Progression,
                Algorithm::Connection,
                Algorithm::LoopGain,
                Algorithm::SVM,
                Algorithm::Reflection,
            ]),
            Day::Thu => Some(vec![
                Algorithm::Deduction,
                Algorithm::DeltaV,
                Algorithm::Paradigm,
                Algorithm::Convolution,
                Algorithm::Exploit,
            ]),
            Day::Fri => Some(vec![
                Algorithm::DataRepair,
                Algorithm::MLRMatrix,
                Algorithm::Cluster,
                Algorithm::Stratagem,
                Algorithm::Resolve,
            ]),
            Day::Sat => None,
            Day::Sun => None,
        }
    }
}

#[tauri::command]
pub fn main_stat_all() -> Vec<AlgoMainStat> {
    vec![
        AlgoMainStat::Hashrate,
        AlgoMainStat::HashratePercent,
        AlgoMainStat::Atk,
        AlgoMainStat::AtkPercent,
        AlgoMainStat::Health,
        AlgoMainStat::HealthPercent,
        AlgoMainStat::Haste,
        AlgoMainStat::CritRate,
        AlgoMainStat::CritDmg,
        AlgoMainStat::DamageInc,
        AlgoMainStat::Dodge,
        AlgoMainStat::HealInc,
        AlgoMainStat::DamageReduction,
        AlgoMainStat::Def,
        AlgoMainStat::DefPercent,
        AlgoMainStat::OperandDef,
        AlgoMainStat::OperandDefPercent,
    ]
}

impl Loadout {
    pub fn new(maxed_slv: bool) -> Self {
        match maxed_slv {
            true => Self {
                skill_level: UnitSkill::max(),
                algo: AlgoSet::new(),
                level: Level(1),
                neural: NeuralExpansion::Three,
                frags: Some(0),
            },
            false => Self {
                skill_level: UnitSkill::new(),
                algo: AlgoSet::new(),
                level: Level(1),
                neural: NeuralExpansion::Three,
                frags: Some(0),
            },
        }
    }
    pub fn new_goal() -> Self {
        Self {
            skill_level: UnitSkill::max(),
            level: Level::max(),
            algo: AlgoSet::new(),
            neural: NeuralExpansion::Five,
            frags: None,
        }
    }
}

impl UnitSkill {
    fn new() -> Self {
        Self {
            passive: 1,
            auto: 1,
        }
    }
    fn max() -> Self {
        Self {
            passive: 10,
            auto: 10,
        }
    }
}
impl AlgoSet {
    pub fn new() -> Self {
        Self {
            offense: vec![AlgoPiece::new(AlgoCategory::Offense)],
            stability: vec![AlgoPiece::new(AlgoCategory::Stability)],
            special: vec![AlgoPiece::new(AlgoCategory::Special)],
        }
    }
}

impl AlgoPiece {
    /// creates an empty Algo piece with specified slots
    pub fn new(category: AlgoCategory) -> Self {
        match category {
            AlgoCategory::Offense => Self {
                name: Algorithm::Feedforward,
                stat: AlgoMainStat::AtkPercent,
                slot: vec![false; 3],
            },
            AlgoCategory::Stability => Self {
                name: Algorithm::Encapsulate,
                stat: AlgoMainStat::Health,
                slot: vec![false; 3],
            },
            AlgoCategory::Special => Self {
                name: Algorithm::DeltaV,
                stat: AlgoMainStat::Haste,
                slot: vec![false; 3],
            },
        }
    }
    pub fn compute_slots(name: Algorithm, current_slots: Vec<bool>) -> Vec<bool> {
        let size: usize = match name {
            Algorithm::Perception
            | Algorithm::Deduction
            | Algorithm::Connection
            | Algorithm::Cluster
            | Algorithm::Convolution
            | Algorithm::Feedforward
            | Algorithm::Inspiration
            | Algorithm::Progression
            | Algorithm::Rationality
            | Algorithm::Stratagem => 2,
            _ => 3,
        };
        let mut res: Vec<bool> = Vec::new();
        for i in 0..size {
            res.push(*current_slots.get(i).unwrap_or(&false));
        }
        res
    }
}

/// updates the requirement field in the store by reading the store field
pub fn update_reqs(store: &UserStore, computed: State<Computed>) -> Result<(), &'static str> {
    // let store_guard = store.store.lock().expect("requesting mutex failed");
    let mut req_guard = computed.database_req.lock().unwrap();
    let mut reqs: Vec<UnitRequirement> = Vec::new();
    for unit in store.units.iter() {
        reqs.push(UnitRequirement {
            skill: requirement_slv(unit.current.skill_level, unit.goal.skill_level),
            neural: NeuralResourceRequirement::default(), // TODO:
            level: LevelRequirement::default(),
            breakthrough: WidgetResourceRequirement::default(), // TODO:
        })
    }
    req_guard.unit_req = reqs;
    Ok(())
}

impl UserStore {
    pub fn generate_example() -> Self {
        Self {
            schema: String::from("https://raw.githubusercontent.com/mnpqraven/pnc-checklist/main/src-tauri/schemas/schema.jsonc"),
            database: Database {
                skill: SkillCurrency::default(),
                coin: Coin::default()
            },
            units: vec![
                Unit {
                    name: String::from("Croque"),
                    class: Class::Guard,
                    current: Loadout {
                        skill_level: UnitSkill { passive: 1, auto: 1 },
                        algo: AlgoSet::default(),
                        level: Level::default(),
                        neural: NeuralExpansion::Three,
                        frags: Some(0)
                    },
                    goal: Loadout {
                        skill_level: UnitSkill::max(),
                        algo: AlgoSet {
                            offense: vec![
                                AlgoPiece {
                                    name: Algorithm::Deduction,
                                    stat: AlgoMainStat::HashratePercent,
                                    slot: vec![true, true]
                                }
                            ],
                            stability: vec![
                                AlgoPiece {
                                    name: Algorithm::Overflow,
                                    stat: AlgoMainStat::DefPercent,
                                    slot: vec![true, true, true]
                                }
                            ],
                            special: vec![
                                AlgoPiece {
                                    name: Algorithm::Stratagem,
                                    stat: AlgoMainStat::DefPercent,
                                    slot: vec![true, true]
                                }
                            ]
                        },
                        level: Level(60),
                        neural: NeuralExpansion::Five,
                        frags: None
                    }
                }
            ]
        }
    }
}

impl Level {
    pub fn max() -> Self {
        Self(70)
    }
}

#[cfg(test)]
mod tests {
    use crate::model::structs::*;

    #[test]
    fn slots_small_to_big() {
        let right = AlgoPiece::compute_slots(Algorithm::DeltaV, vec![true, true]);
        assert_eq!(vec![true, true, false], right);

        let right = AlgoPiece::compute_slots(Algorithm::MLRMatrix, vec![false, true]);
        assert_eq!(vec![false, true, false], right);
    }
    #[test]
    fn slots_big_to_small() {
        let right = AlgoPiece::compute_slots(Algorithm::Connection, vec![true, true, true]);
        assert_eq!(vec![true, true], right);

        let right = AlgoPiece::compute_slots(Algorithm::Inspiration, vec![true, false, true]);
        assert_eq!(vec![true, false], right);

        let right = AlgoPiece::compute_slots(Algorithm::Feedforward, vec![false, true, false]);
        assert_eq!(vec![false, true], right);
    }
}

impl ResourceByDay {
    pub fn get_bonuses(day: Day) -> Self {
        unsafe {
            Self {
                day,
                coin: BONUS_TABLE.get_unchecked(day as usize)[0],
                exp: BONUS_TABLE.get_unchecked(day as usize)[1],
                skill: BONUS_TABLE.get_unchecked(day as usize)[2],
                class: BONUS_TABLE.get_unchecked(day as usize)[3],
                algos: Algorithm::get_bonuses(day),
            }
        }
    }
}

impl AlgoTypeDb {
    fn get_algo(category: AlgoCategory) -> Self {
        let algos: Vec<Algorithm> = match category {
            AlgoCategory::Offense => ALGO_OFFENSE.to_vec(),
            AlgoCategory::Stability => ALGO_STABILITY.to_vec(),
            AlgoCategory::Special => ALGO_SPECIAL.to_vec(),
        };
        Self { category, algos }
    }

    pub fn generate_algo_db() -> Vec<AlgoTypeDb> {
        vec![
            AlgoTypeDb::get_algo(AlgoCategory::Offense),
            AlgoTypeDb::get_algo(AlgoCategory::Stability),
            AlgoTypeDb::get_algo(AlgoCategory::Special),
        ]
    }
}

impl GrandResource {
    pub fn new() -> Self {
        Self {
            skill: SkillCurrency { token: 0, pivot: 0 },
            coin: Coin(0),
            widgets: Vec::new(),
            exp: Exp(0),
            neural_kits: 0,
        }
    }
    pub fn combine(&mut self, with: Self)  {
        let mut widgets: Vec<WidgetResource> = Vec::new();
        let coin = self.coin.0 + with.coin.0;
        for class in Class::iter() {
            let in_self = self.widgets.iter().find(|e| e.class == class);
            let in_with = with.widgets.iter().find(|e| e.class == class);
            let widget_inventory: [u32; 6] = match (in_self, in_with) {
                (Some(a), Some(b)) => {
                    let mut sum: [u32; 6] = [0; 6];
                    for index in (0..6).into_iter() {
                        sum[index] = a.widget_inventory[index] + b.widget_inventory[index];
                    }
                    sum
                }
                (Some(a), None) => a.widget_inventory,
                (None, Some(b)) => b.widget_inventory,
                (None, None) => [0; 6],
            };
            widgets.push(WidgetResource {
                class,
                widget_inventory,
            })
        }
        *self = Self {
            skill: SkillCurrency {
                token: self.skill.token + with.skill.token,
                pivot: self.skill.pivot + with.skill.pivot,
            },
            coin: Coin(coin),
            widgets,
            exp: Exp(self.exp.0 + with.exp.0),
            neural_kits: self.neural_kits + with.neural_kits,
        };
    }
}
