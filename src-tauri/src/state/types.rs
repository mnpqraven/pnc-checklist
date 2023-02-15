use crate::{
    algorithm::types::AlgoPiece, requirement::types::DatabaseRequirement, stats::types::*,
    unit::types::*,
};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex, Weak};
use ts_rs::TS;

/// Main storage, state managed by tauri
#[derive(JsonSchema)]
pub struct JSONStorage {
    pub store: Mutex<UserJSON>,   // User's JSON
    pub db: Mutex<GrandResource>, // generated struct
}

#[derive(Serialize, Deserialize, Debug, TS, JsonSchema)]
#[ts(export, export_to = "bindings/structs/")]
pub struct UserJSON {
    #[serde(rename = "$schema")]
    pub schema: String,
    pub database: Database,
    pub units: Vec<Unit>,
}

#[derive(Serialize, Deserialize, Debug, TS, Clone, JsonSchema)]
#[ts(export, export_to = "bindings/structs/")]
pub struct Database {
    pub skill: SkillCurrency,
    pub coin: Coin,
}

#[derive(Debug, Serialize, Deserialize, Default, TS, JsonSchema)]
#[ts(export, export_to = "bindings/structs/")]
pub struct GrandResource {
    pub skill: SkillCurrency,
    pub coin: Coin,
    pub widgets: Vec<WidgetResource>,
    pub exp: Exp,
    pub neural_kits: u32,
}

/// data computed from the backend, state managed by tauri
pub struct Computed {
    pub database_req: Mutex<DatabaseRequirement>,
    pub units: Mutex<Vec<Arc<Mutex<Unit>>>>,
}

// -- structs for the InvTable and hookup management between user units and db
#[derive(Debug, Serialize)]
pub struct KeychainTable {
    pub keychains: Mutex<Vec<Keychain>>,
}

#[derive(Debug, Serialize)]
pub struct Keychain {
    pub unit: Weak<Mutex<Unit>>,
    pub locker: Arc<Mutex<AlgoPiece>>, // piece items in above unit
}
