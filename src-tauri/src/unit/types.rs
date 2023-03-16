use crate::{algorithm::types::AlgoSet, loadout::types::LoadoutType};
use crate::stats::types::*;
use rspc::Type;
use serde::{Deserialize, Serialize};
use strum::{EnumIter, Display};
use schemars::JsonSchema;
use strum_macros::EnumString;

#[derive(Serialize, Deserialize, Default, Debug, Clone, Type, JsonSchema)]
pub struct Unit {
    pub name: String,
    pub class: Class,
    pub current: Loadout,
    pub goal: Loadout,
}

#[derive(Serialize, Deserialize, Default, Debug, Clone, Type, JsonSchema)]
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
    pub loadout_type: LoadoutType
}

#[derive(Serialize, Deserialize, Debug, Display, Clone, Copy, PartialEq, Eq, Default, Type, EnumIter, JsonSchema, EnumString)]
pub enum Class {
    #[default]
    Guard,
    Medic,
    Sniper,
    Specialist,
    Warrior,
}

#[derive(Debug, Display, Serialize, Deserialize, Copy, Clone, Type, EnumIter, JsonSchema, EnumString)]
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
