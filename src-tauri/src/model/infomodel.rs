use std::fmt::Display;

use serde::{Serialize, Deserialize};

use crate::parser::calc::SkillResourceRequirement;

// need to init loading specifying algo quantity for each class ?
#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub enum Class {
    Guard,
    Warrior,
    Sniper,
    Specialist,
    Medic,
}
#[allow(clippy::upper_case_acronyms)]
/// List of algorithms
#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub enum Algorithm {
    //offense
    TowerLimit,
    Feedforward,
    Deduction,
    Progression,
    DataRepair,
    MLRMatrix,
    //stability
    Encapsulate,
    Iteration,
    Perception,
    Overflow,
    Rationality,
    Convolution,
    //special
    Inspiration,
    LoopGain,
    SVM,
    Paradigm,
    DeltaV,
    Cluster,
    Stratagem,
    // blank slot
    BLANK // null
}

impl Display for Algorithm {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let label = match self {
            Algorithm::TowerLimit => "Tower Limit",
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
            Algorithm::BLANK => "BLANK"
        };
        write!(f, "{label}")
    }
}

#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub enum AlgoMainStat {
    Hashrate,
    HashratePercent,
    Atk,
    AtkPer,
    Health,
    HealthPercent,
    Haste,
    HealInc,
    BLANK // null
}
#[derive(Serialize, Deserialize)]
pub enum AlgoSubStat {
    CritRate,
    CritDmg,
    Hashrate,
    HashratePercent,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SkillCurrency {
    token: u32,
    pivot: u32,
}
#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct UnitSkill {
    pub passive: u32,
    pub auto: u32,
}

// WRAPPER STRUCTS FOR IMPORT MODEL
#[derive(Serialize, Deserialize, Debug)]
pub struct Database {
    skill: SkillCurrency,
    coin: u32
}
#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct AlgoPiece {
    name: Algorithm, // "name"
    stat: AlgoMainStat, // "stat"
    // sub_stat: Option<Vec<AlgoSubStat>>,
    slot: Vec<u32>, // "slot"
}
#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct AlgoSet {
    offense: Vec<AlgoPiece>,
    stability: Vec<AlgoPiece>,
    special: Vec<AlgoPiece>,
}
#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct Loadout {
    skill_level: Option<UnitSkill>, // None defaults to slv 10
    algo: AlgoSet
}
#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct Unit {
    name: String,
    class: Class,
    current: Loadout,
    goal: Loadout,
}

#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct ImportChunk {
    #[serde(rename="$schema")]
    schema: String,
    database: Database,
    units: Vec<Unit>
}
#[derive(Serialize, Deserialize)]
#[derive(Debug)]
pub struct SchemalessImportChunk {
    database: Database,
    units: Vec<Unit>
}