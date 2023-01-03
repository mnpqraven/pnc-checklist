use super::infomodel::*;
use crate::parser::requirement::{UnitRequirement, NeuralResourceRequirement, WidgetResourceRequirement, LevelRequirement};
use crate::requirement_slv;
use crate::startup::Storage;
use std::fmt::Display;
use tauri::State;

impl Display for Algorithm {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let label = match self {
            Algorithm::LowerLimit => "Lower Limit",
            Algorithm::Feedforward => "Feedforward",
            Algorithm::Deduction => "Deduction",
            Algorithm::Progression => "Progression",
            Algorithm::DataRepair => "Data Repair",
            Algorithm::MLRMatrix => "MLR Matrix",
            Algorithm::Encapsulate => "Encapsulate",
            Algorithm::Iteration => "Iteration",
            Algorithm::Perception => "Perception",
            Algorithm::Overflow => "Overflow",
            Algorithm::Rationality => "Rationality",
            Algorithm::Connection => "Connection",
            Algorithm::Convolution => "Convolution",
            Algorithm::Inspiration => "Inspiration",
            Algorithm::LoopGain => "Loop Gain",
            Algorithm::SVM => "S.V.M",
            Algorithm::Paradigm => "Paradigm",
            Algorithm::DeltaV => "Delta V",
            Algorithm::Cluster => "Cluster",
            Algorithm::Stratagem => "Stratagem",
            // gen 2
            Algorithm::Stack => "Stack",
            Algorithm::LimitValue => "Limit Value",
            Algorithm::Reflection => "Reflection",
            Algorithm::Resolve => "Resolve",
            Algorithm::Exploit => "Exploit",
        };
        write!(f, "{label}")
    }
}

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

impl Display for AlgoMainStat {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let label = match self {
            AlgoMainStat::Hashrate => "Hashrate",
            AlgoMainStat::HashratePercent => "Hashrate %",
            AlgoMainStat::Atk => "Attack",
            AlgoMainStat::AtkPercent => "Atk %",
            AlgoMainStat::Health => "Health",
            AlgoMainStat::HealthPercent => "Health %",
            AlgoMainStat::Haste => "Haste",
            AlgoMainStat::CritRate => "Critical Rate",
            AlgoMainStat::CritDmg => "Critical Damage",
            AlgoMainStat::DamageInc => "Damage Increase",
            AlgoMainStat::Dodge => "Dodge",
            AlgoMainStat::HealInc => "Heal Increase",
            AlgoMainStat::DamageReduction => "Damage Reduction",
            AlgoMainStat::Def => "Defense",
            AlgoMainStat::DefPercent => "Defense %",
            AlgoMainStat::OperandDef => "Openrand Defense",
            AlgoMainStat::OperandDefPercent => "Operand Defense %",
        };
        write!(f, "{label}")
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
            },
            false => Self {
                skill_level: UnitSkill::new(),
                algo: AlgoSet::new(),
            },
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
}

/// updates the requirement field in the store by reading the store field
pub fn update_reqs(store: State<Storage>) -> Result<(), &'static str> {
    let store_guard = store.store.lock().expect("requesting mutex failed");
    let mut req_guard = store.database_req.lock().unwrap();
    let mut reqs: Vec<UnitRequirement> = Vec::new();
    for unit in store_guard.units.iter() {
        reqs.push(UnitRequirement {
            skill: requirement_slv(unit.current.skill_level, unit.goal.skill_level),
            neural: NeuralResourceRequirement::default(), // TODO:
            level: LevelRequirement::default(),
            breakthrough: WidgetResourceRequirement::default() // TODO:
        })
    }
    req_guard.unit_req = reqs;
    Ok(())
}

impl ImportChunk {
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
                        algo: AlgoSet { offense: vec![], stability: vec![], special: vec![] }
                    },
                    goal: Loadout {
                        skill_level: UnitSkill { passive: 10, auto: 10 },
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
                        }
                    }
                }
            ]
        }
    }
}
