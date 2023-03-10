use crate::algorithm::types::*;
use crate::stats::types::*;
use crate::unit::types::*;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

/// struct for the requirement screen, gathers all requirements needed, single
///  requirement can be accessed by fields
/// SoSoA
#[derive(Debug)]
pub struct DatabaseRequirement {
    pub unit_req: Vec<UnitRequirement>,
}

/// struct for single unit
#[derive(Debug)]
pub struct UnitRequirement {
    pub skill: SkillResourceRequirement,
    pub neural: NeuralResourceRequirement,
    pub level: LevelRequirement,
    pub breakthrough: WidgetResourceRequirement,
    pub algo: AlgorithmRequirement,
}

/// Tokens and pivots a unit would need to max out its skill
#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct SkillResourceRequirement {
    pub token: u32,
    pub pivot: u32,
    pub coin: Coin,
}

#[derive(Debug, Serialize, Deserialize, Default, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct LevelRequirement {
    pub exp: Exp,
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
    #[serde(default)]
    pub frags: NeuralFragment,
    pub coin: Coin,
    pub kits: u32,
}

// NOTE: probably need to consider what fields are needed here
#[derive(Debug, Serialize, Deserialize, Default, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct AlgorithmRequirement {
    pub pieces: Vec<AlgoPiece>,
    pub from_unit: Unit,
}
