use crate::unit::types::Class;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Default, Clone, Copy, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct Exp(pub u32);

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

#[derive(Debug, Serialize, Deserialize, Clone, Copy, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct Level(pub u32);

#[derive(Serialize, Deserialize, Debug, Clone, Copy, TS, PartialEq)]
#[ts(export, export_to = "bindings/structs/")]
pub struct NeuralFragment(pub Option<u32>);

#[derive(Debug, Serialize, Deserialize, Default, Clone, Copy, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct WidgetResource {
    pub class: Class,
    pub widget_inventory: [u32; 6],
}
