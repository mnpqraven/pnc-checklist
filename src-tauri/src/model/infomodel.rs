use serde::{Deserialize, Serialize};

use crate::parser::requirement::NeuralExpansion;

// NOTE: need to init loading specifying algo quantity for each class ?
#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq, Default)]
pub enum Class {
    #[default]
    Guard,
    Warrior,
    Sniper,
    Specialist,
    Medic,
}

#[allow(clippy::upper_case_acronyms)]
#[derive(Serialize, Deserialize, Debug, Clone)]
/// List of algorithms
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
    Connection,
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

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct SkillCurrency {
    pub token: u32,
    pub pivot: u32,
}
#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
pub struct UnitSkill {
    pub passive: u32,
    pub auto: u32,
}
#[derive(Serialize, Deserialize, Debug, Default)]
pub struct Coin(pub u32);

// WRAPPER STRUCTS FOR IMPORT MODEL
// TODO: needs a new or default fn to create empty units, same as clicking
// add button for frontend, should be legit right away
#[derive(Serialize, Deserialize, Debug)]
pub struct Database {
    pub skill: SkillCurrency,
    pub coin: Coin,
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
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AlgoSet {
    pub offense: Vec<AlgoPiece>,
    pub stability: Vec<AlgoPiece>,
    pub special: Vec<AlgoPiece>,
}
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Loadout {
    #[serde(default)]
    pub skill_level: UnitSkill,
    #[serde(default)]
    pub level: Level,
    #[serde(default)]
    pub algo: AlgoSet,
    #[serde(default)]
    pub neural: NeuralExpansion,
    #[serde(default)]
    pub frags: u32
}
// TODO: move
#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
pub struct Level(pub u32);
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Unit {
    pub name: String,
    pub class: Class,
    pub current: Loadout,
    pub goal: Loadout,
}

// TODO: need another wrapper
// ImportChunk has all the options > go through Option<> check into another struct
#[derive(Serialize, Deserialize, Debug)]
pub struct UserStore {
    #[serde(rename = "$schema")]
    pub schema: String,
    pub database: Database,
    pub units: Vec<Unit>,
}
