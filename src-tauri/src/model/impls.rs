use super::infomodel::*;
use crate::{
    parser::calc::{GrandResource, requirement_slv, UnitRequirement},
    startup::Storage,
};
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
            Algorithm::Convolution => "Convolution",
            Algorithm::Inspiration => "Inspiration",
            Algorithm::LoopGain => "Loop Gain",
            Algorithm::SVM => "S.V.M",
            Algorithm::Paradigm => "Paradigm",
            Algorithm::DeltaV => "Delta V",
            Algorithm::Cluster => "Cluster",
            Algorithm::Stratagem => "Stratagem",
        };
        write!(f, "{label}")
    }
}

impl Algorithm {
    pub fn all() -> Vec<Algorithm> {
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
}
#[tauri::command]
pub fn algorithm_all() -> Vec<Algorithm> {
    Algorithm::all()
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
            AlgoMainStat::OpenrandDef => "Openrand Defense",
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
        AlgoMainStat::OpenrandDef,
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
#[tauri::command]
pub fn algo_set_new() -> AlgoSet {
    AlgoSet::new()
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
#[tauri::command]
pub fn algo_piece_new(category: AlgoCategory) -> AlgoPiece {
    AlgoPiece::new(category)
}

/// updates the requirement field in the store by reading the store field
pub fn update_reqs(store: State<Storage>) -> Result<(), &'static str> {
    let store_guard = store.store.lock().expect("requesting mutex failed");
    let mut req_guard = store.database_req.lock().unwrap();
    let mut reqs: Vec<UnitRequirement> = Vec::new();
    for unit in store_guard.units.iter() {
        reqs.push(UnitRequirement {
            skill: requirement_slv(unit.current.skill_level, unit.goal.skill_level),
        })
    }
    req_guard.unit_req = reqs;
    Ok(())
}

#[tauri::command]
pub fn get_needed_rsc(store: State<Storage>) -> GrandResource {
    println!("ping");
    let guard_req = store.database_req.lock().unwrap();
    let (mut slv_token, mut slv_pivot, mut coin) = (0, 0, 0);
    for req in guard_req.unit_req.iter() {
        slv_pivot += req.skill.pivot;
        slv_token += req.skill.token;
        coin += req.skill.coin;
    }

    let t = GrandResource {
        slv_token,
        slv_pivot,
        coin,
    };
    println!("{:?}", t);
    t
}
