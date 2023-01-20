use crate::{stats::types::*, unit::types::*};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

// WRAPPER STRUCTS FOR IMPORT MODEL
// TODO: needs a new or default fn to create empty units, same as clicking
// add button for frontend, should be legit right away
#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct Database {
    pub skill: SkillCurrency,
    pub coin: Coin,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct UserStore {
    #[serde(rename = "$schema")]
    pub schema: String,
    pub database: Database,
    pub units: Vec<Unit>,
}
