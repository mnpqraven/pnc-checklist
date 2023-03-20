use crate::{algorithm::types::IAlgoSet, loadout::types::LoadoutType};
use crate::stats::types::*;
use rspc::Type;
use serde::{Deserialize, Serialize};
use strum::{EnumIter, Display};
use schemars::JsonSchema;
use strum_macros::EnumString;

#[derive(Serialize, Deserialize, Default, Debug, Clone, Type, JsonSchema)]
pub struct IUnit {
    pub name: String,
    pub class: Class,
    pub current: ILoadout,
    pub goal: ILoadout,
}

#[derive(Serialize, Deserialize, Default, Debug, Clone, Type, JsonSchema)]
pub struct ILoadout {
    #[serde(default)]
    pub skill_level: IUnitSkill,
    #[serde(default)]
    pub level: ILevel,
    #[serde(default)]
    pub algo: IAlgoSet,
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
