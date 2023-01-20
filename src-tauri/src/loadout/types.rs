use serde::{Deserialize, Serialize};
use strum::EnumIter;
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, Copy, Clone, TS, EnumIter)]
#[ts(export, export_to = "bindings/enums/")]
#[ts(rename_all = "lowercase")]
pub enum LoadoutType {
    Current,
    Goal,
}
