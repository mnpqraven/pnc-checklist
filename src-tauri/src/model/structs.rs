pub use super::enums::*;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Default, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct SkillCurrency {
    pub token: u32,
    pub pivot: u32,
}
#[derive(Serialize, Deserialize, Debug, Clone, Copy, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct UnitSkill {
    pub passive: u32,
    pub auto: u32,
}
#[derive(Serialize, Deserialize, Debug, Default, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct Coin(pub u32);

// WRAPPER STRUCTS FOR IMPORT MODEL
// TODO: needs a new or default fn to create empty units, same as clicking
// add button for frontend, should be legit right away
#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct Database {
    pub skill: SkillCurrency,
    pub coin: Coin,
}
#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct AlgoPiece {
    pub name: Algorithm,
    pub stat: AlgoMainStat,
    // sub_stat: Option<Vec<AlgoSubStat>>,
    pub slot: Vec<bool>,
}

#[tauri::command]
pub fn algo_category_all() -> Vec<AlgoCategory> {
    vec![
        AlgoCategory::Offense,
        AlgoCategory::Stability,
        AlgoCategory::Special,
    ]
}
#[derive(Serialize, Deserialize, Debug, Clone, Default, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct AlgoSet {
    pub offense: Vec<AlgoPiece>,
    pub stability: Vec<AlgoPiece>,
    pub special: Vec<AlgoPiece>,
}
#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "bindings/structs/")]
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
    pub frags: Option<u32>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct Level(pub u32);

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct Unit {
    pub name: String,
    pub class: Class,
    pub current: Loadout,
    pub goal: Loadout,
}

// TODO: need another wrapper
// ImportChunk has all the options > go through Option<> check into another struct
#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct UserStore {
    #[serde(rename = "$schema")]
    pub schema: String,
    pub database: Database,
    pub units: Vec<Unit>,
}

/// Tokens and pivots a unit would need to max out its skill
#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "bindings/structs/")]
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
#[derive(Debug, Serialize, Deserialize, Default, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct Exp(pub u32);
#[derive(Debug, Serialize, Deserialize, Default, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct GrandResource {
    pub skill: SkillCurrency,
    pub coin: Coin,
    pub widgets: Vec<WidgetResource>,
    pub exp: Exp,
    pub neural_kits: u32,
    // rolls ?
}
#[derive(Debug, Serialize, Deserialize, Default, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct WidgetResourceRequirement {
    pub widget: WidgetResource,
    pub coin: Coin,
}
#[derive(Debug, Serialize, Deserialize, Default, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct NeuralResourceRequirement {
    pub frags: u32,
    pub coin: Coin,
}
#[derive(Debug, Serialize, Deserialize, Default, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct WidgetResource {
    pub class: Class,
    pub widget_inventory: [u32; 6],
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
#[derive(Debug, Serialize, Deserialize, Default, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct LevelRequirement {
    pub exp: Exp,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct AlgoTypeDb {
    pub category: AlgoCategory,
    pub algos: Vec<Algorithm>,
}

#[derive(Serialize, ts_rs::TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct ResourceByDay {
    pub day: Day,
    pub coin: Option<Bonus>,
    pub exp: Option<Bonus>,
    pub skill: Option<Bonus>,
    pub class: Option<Bonus>,
    pub algos: Option<Vec<Algorithm>>,
}
