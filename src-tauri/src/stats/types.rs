use crate::unit::types::Class;
use rspc::Type;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Default, Clone, Copy, Type, JsonSchema)]
pub struct Exp(pub u32);

#[derive(Serialize, Deserialize, Debug, Default, Type, Clone, JsonSchema)]
pub struct SkillCurrency {
    pub token: u32,
    pub pivot: u32,
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy, Type, JsonSchema)]
pub struct UnitSkill {
    pub passive: u32,
    pub auto: u32,
}

#[derive(Serialize, Deserialize, Debug, Default, Type, Clone, JsonSchema)]
pub struct Coin(pub u32);

#[derive(Debug, Serialize, Deserialize, Clone, Copy, Type, JsonSchema)]
pub struct Level(pub u32);

#[derive(Serialize, Deserialize, Debug, Clone, Copy, Type, PartialEq, JsonSchema)]
pub struct NeuralFragment(pub Option<u32>);

#[derive(Debug, Serialize, Deserialize, Default, Clone, Copy, Type, JsonSchema)]
pub struct WidgetResource {
    pub class: Class,
    pub widget_inventory: [u32; 6],
}
