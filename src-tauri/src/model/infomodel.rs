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
    LowerLimit,
    Feedforward,
    Deduction,
    Progression,
    DataRepair,
    MLRMatrix,
    Stack,
    LimitValue,
    //stability
    Encapsulate,
    Iteration,
    Perception,
    Overflow,
    Rationality,
    Convolution,
    Reflection,
    Resolve,
    //special
    Inspiration,
    LoopGain,
    SVM,
    Paradigm,
    DeltaV,
    Cluster,
    Stratagem,
    Exploit,
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
pub enum Day {
    Mon,
    Tue,
    Wed,
    Thu,
    Fri,
    Sat,
    Sun,
}
#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum Bonus {
    Coin,
    Exp,
    Skill,
    Class(Class),
    Algos(Vec<Algorithm>),
}

#[allow(clippy::upper_case_acronyms)]
#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum AlgoMainStat {
    Hashrate,
    HashratePercent,
    Atk,
    AtkPercent,
    Health,
    HealthPercent,
    Haste,
    CritRate,
    CritDmg,
    DamageInc,
    Dodge,
    HealInc,
    DamageReduction,
    Def,
    DefPercent,
    OperandDef,
    OperandDefPercent,
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
#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
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
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AlgoPiece {
    pub name: Algorithm,    // "name"
    pub stat: AlgoMainStat, // "stat"
    // sub_stat: Option<Vec<AlgoSubStat>>,
    pub slot: Vec<bool>, // "slot"
}

#[derive(Serialize, Deserialize, PartialEq, Eq, Debug, Clone, Copy)]
pub enum AlgoCategory {
    Offense,
    Stability,
    Special,
}
#[tauri::command]
pub fn algo_category_all() -> Vec<AlgoCategory> {
    vec![
        AlgoCategory::Offense,
        AlgoCategory::Stability,
        AlgoCategory::Special,
    ]
}
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AlgoSet {
    pub offense: Vec<AlgoPiece>,
    pub stability: Vec<AlgoPiece>,
    pub special: Vec<AlgoPiece>,
}
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Loadout {
    pub skill_level: UnitSkill, // None defaults to slv 10
    pub algo: AlgoSet,
}
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Unit {
    pub name: String,
    pub class: Class,
    pub current: Loadout,
    pub goal: Loadout,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ImportChunk {
    #[serde(rename = "$schema")]
    pub schema: String,
    pub database: Database,
    pub units: Vec<Unit>,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct SchemalessImportChunk {
    database: Database,
    units: Vec<Unit>,
}
