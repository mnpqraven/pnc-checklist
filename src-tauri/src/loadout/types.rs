use rspc::Type;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use strum::{Display, EnumIter};

#[derive(Debug, Display, Serialize, Deserialize, Copy, Clone, Type, EnumIter, JsonSchema)]
pub enum LoadoutType {
    Current,
    Goal,
}

impl Default for LoadoutType {
    fn default() -> Self {
        Self::Current
    }
}
