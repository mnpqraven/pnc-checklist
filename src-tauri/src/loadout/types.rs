use serde::{Deserialize, Serialize};
use strum::{EnumIter, Display};
use ts_rs::TS;

#[derive(Debug, Display, Serialize, Deserialize, Copy, Clone, TS, EnumIter)]
#[ts(export, export_to = "bindings/enums/")]
#[ts(rename_all = "lowercase")]
pub enum LoadoutType {
    Current,
    Goal,
}
