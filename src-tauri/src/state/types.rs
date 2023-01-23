use crate::{
    algorithm::types::AlgoPiece, requirement::types::DatabaseRequirement, stats::types::*,
    unit::types::*,
};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use ts_rs::TS;

/// Main storage, state managed by tauri
pub struct Storage {
    pub store: Mutex<UserStore>,  // User's JSON
    pub db: Mutex<GrandResource>, // User's JSON
    /// list holding items of each unit in userstore.
    /// Act as psuedo-inventory by transforming Vec<Locker> to <T> via impl fns
    pub lockers: Mutex<Vec<Locker>>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct UserStore {
    #[serde(rename = "$schema")]
    pub schema: String,
    pub database: Database,
    pub units: Vec<Unit>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct Database {
    pub skill: SkillCurrency,
    pub coin: Coin,
}

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

/// data computed from the backend, state managed by tauri
pub struct Computed {
    pub database_req: Mutex<DatabaseRequirement>,
    pub keychain_table: Arc<Mutex<KeychainTable>>,
}

// -- structs for the InvTable and hookup management between user units and db
#[derive(Debug, Default, Serialize, TS, Clone)]
#[ts(export, export_to = "bindings/structs/")]
pub struct KeychainTable {
    pub keychains: Vec<Keychain>,
}

#[derive(Debug, Default, Serialize, Clone, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct Keychain {
    pub owner: Arc<Unit>,     // points to user's Unit vec
    pub locker: Arc<Locker>,  // points to Computed's Locker Vec
}

#[derive(Debug, Default, TS, Serialize, Deserialize, Clone)]
#[ts(export, export_to = "bindings/structs/")]
pub struct Locker(pub Vec<AlgoPiece>); // expand point here for future fields