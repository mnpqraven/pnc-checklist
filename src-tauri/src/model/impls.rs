use super::infomodel::*;
use std::fmt::Display;

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
            Algorithm::BLANK => "BLANK",
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
            AlgoMainStat::BLANK => "BLANK",
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
            offense: vec![AlgoPiece::new(vec![false; 3])],
            stability: vec![AlgoPiece::new(vec![false; 3])],
            special: vec![AlgoPiece::new(vec![false; 3])],
        }
    }
}
#[tauri::command]
pub fn algo_set_new() -> AlgoSet {
    AlgoSet::new()
}

impl AlgoPiece {
    /// creates an empty Algo piece with specified slots
    pub fn new(slot: Vec<bool>) -> Self {
        Self {
            name: Algorithm::BLANK,
            stat: AlgoMainStat::BLANK,
            slot,
        }
    }
}
#[tauri::command]
pub fn algo_piece_new() -> AlgoPiece {
    AlgoPiece::new(vec![false; 3])
}
