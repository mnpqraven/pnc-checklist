use super::infomodel::*;
use crate::parser::requirement::{
    LevelRequirement, NeuralExpansion, NeuralResourceRequirement, UnitRequirement,
    WidgetResourceRequirement,
};
use crate::requirement_slv;
use crate::startup::Computed;
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
    use crate::model::infomodel::{AlgoPiece, Algorithm};

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
