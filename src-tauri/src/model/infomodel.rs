use serde::{Deserialize, Serialize};

// NOTE: need to init loading specifying algo quantity for each class ?
#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq)]
pub enum Class {
    Guard,
    Warrior,
    Sniper,
    Specialist,
    Medic,
}

#[allow(clippy::upper_case_acronyms)]
/// List of algorithms
#[derive(Serialize, Deserialize, Debug, Clone)]
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
    BLANK,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum Day {
    Mon,
    Tue,
    Wed,
    Thu,
    Fri,
    Sat,
    Sun,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct Timetable {
    pub day: Day,
    pub algos: Option<Vec<Algorithm>>,
}

#[allow(clippy::upper_case_acronyms)]
#[derive(Serialize, Deserialize, Debug)]
pub enum AlgoMainStat {
    Hashrate,
    HashratePercent,
    Atk,
    AtkPer,
    Health,
    HealthPercent,
    Haste,
    HealInc,
    BLANK, // null
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
#[derive(Serialize, Deserialize, Debug)]
pub struct UnitSkill {
    pub passive: u32,
    pub auto: u32,
}
impl Default for UnitSkill {
    fn default() -> Self {
        Self {
            passive: 1,
            auto: 1,
        }
    }
}

// WRAPPER STRUCTS FOR IMPORT MODEL
// TODO: needs a new or default fn to create empty units, same as clicking
// add button for frontend, should be legit right away
#[derive(Serialize, Deserialize, Debug)]
pub struct Database {
    skill: SkillCurrency,
    coin: u32,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct AlgoPiece {
    pub name: Algorithm,    // "name"
    pub stat: AlgoMainStat, // "stat"
    // sub_stat: Option<Vec<AlgoSubStat>>,
    pub slot: Vec<u32>, // "slot"
}
impl AlgoPiece {
    /// creates an empty Algo piece with specified slots
    pub fn new(slot: Vec<u32>) -> Self {
        Self {
            name: Algorithm::BLANK,
            stat: AlgoMainStat::BLANK,
            slot,
        }
    }
}

#[derive(Serialize, Deserialize, PartialEq, Eq, Debug)]
pub enum AlgoCategory {
    Offense,
    Stability,
    Special,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct AlgoSet {
    pub offense: Vec<AlgoPiece>,
    pub stability: Vec<AlgoPiece>,
    pub special: Vec<AlgoPiece>,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct Loadout {
    pub skill_level: Option<UnitSkill>, // None defaults to slv 10
    pub algo: AlgoSet,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct Unit {
    pub name: String,
    pub class: Class,
    pub current: Loadout,
    pub goal: Loadout,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ImportChunk {
    #[serde(rename = "$schema")]
    schema: String,
    pub database: Database,
    pub units: Vec<Unit>,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct SchemalessImportChunk {
    database: Database,
    units: Vec<Unit>,
}
