use rspc::Type;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use strum::{Display, EnumIter};
use strum_macros::EnumString;

#[derive(Debug, Display, Serialize, Deserialize, Copy, Clone, Type, EnumIter, JsonSchema, EnumString, Eq, PartialEq)]
pub enum LoadoutType {
    Current,
    Goal,
}

impl Default for LoadoutType {
    fn default() -> Self {
        Self::Current
    }
}
