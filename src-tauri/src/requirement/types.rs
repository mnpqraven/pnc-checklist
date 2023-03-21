use crate::algorithm::types::*;
use crate::stats::types::*;
use rspc::Type;
use serde::{Deserialize, Serialize};

// pub trait Requirement {
//     async fn calculate<T>(&self, cal_fun: fn()) -> Result<Self, RequirementError<T>>;
// }

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
    pub unit_id: Option<String>
}

/// Tokens and pivots a unit would need to max out its skill
#[derive(Serialize, Deserialize, Debug, Type)]
pub struct SkillResourceRequirement {
    pub token: u32,
    pub pivot: u32,
    pub coin: Coin,
    pub from_unit_id: Option<String>
}

#[derive(Debug, Serialize, Deserialize, Default, Type)]
pub struct LevelRequirement {
    pub exp: Exp,
    pub from_unit_id: Option<String>
}

#[derive(Debug, Serialize, Deserialize, Default, Type)]
pub struct WidgetResourceRequirement {
    pub widget: WidgetResource,
    pub coin: Coin,
    pub from_unit_id: Option<String>
}

#[derive(Debug, Serialize, Deserialize, Default, Type)]
pub struct NeuralResourceRequirement {
    #[serde(default)]
    pub frags: NeuralFragment,
    pub coin: Coin,
    pub kits: u32,
    pub from_unit_id: Option<String>
}

// NOTE: probably need to consider what fields are needed here
#[derive(Debug, Serialize, Deserialize, Default, Type)]
pub struct AlgorithmRequirement {
    pub pieces: Vec<IAlgoPiece>,
    pub from_unit_id: Option<String>,
}
