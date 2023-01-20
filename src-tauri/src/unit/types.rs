use crate::algorithm::types::AlgoSet;
use crate::stats::types::*;
use serde::{Deserialize, Serialize};
use strum::EnumIter;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Clone, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct Unit {
    pub name: String,
    pub class: Class,
    pub current: Loadout,
    pub goal: Loadout,
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
    pub frags: NeuralFragment,
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq, Default, TS, EnumIter)]
#[ts(export, export_to = "bindings/enums/")]
pub enum Class {
    #[default]
    Guard,
    Medic,
    Sniper,
    Specialist,
    Warrior,
}

#[derive(Debug, Serialize, Deserialize, Copy, Clone, TS, EnumIter)]
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
