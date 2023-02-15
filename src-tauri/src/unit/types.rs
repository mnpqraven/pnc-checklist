use crate::algorithm::types::AlgoSet;
use crate::stats::types::*;
use serde::{Deserialize, Serialize};
use strum::{EnumIter, Display};
use schemars::JsonSchema;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Default, Debug, Clone, TS, JsonSchema)]
#[ts(export, export_to = "bindings/structs/")]
pub struct Unit {
    pub name: String,
    pub class: Class,
    pub current: Loadout,
    pub goal: Loadout,
}

#[derive(Serialize, Deserialize, Default, Debug, Clone, TS, JsonSchema)]
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
    pub frags: NeuralFragment,
}

#[derive(Serialize, Deserialize, Debug, Display, Clone, Copy, PartialEq, Eq, Default, TS, EnumIter, JsonSchema)]
#[ts(export, export_to = "bindings/enums/")]
pub enum Class {
    #[default]
    Guard,
    Medic,
    Sniper,
    Specialist,
    Warrior,
}

#[derive(Debug, Display, Serialize, Deserialize, Copy, Clone, TS, EnumIter, JsonSchema)]
#[ts(export, export_to = "bindings/enums/")]
pub enum NeuralExpansion {
    One,
    OneHalf,
    Two,
    TwoHalf,
    Three,
    ThreeHalf,
    Four,
    FourHalf,
    Five,
}
