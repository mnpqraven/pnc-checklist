use crate::algorithm::types::{AlgoCategory, Algorithm, AlgoMainStat};
use serde::{Deserialize, Serialize};
use std::fmt::Display;

#[derive(Debug, Serialize, Deserialize)]
pub enum RequirementError<T> {
    OutOfBound(T),
    FromTo(T, T),
    None(T),
}

impl<T: Display> Display for RequirementError<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let err = match self {
            RequirementError::OutOfBound(t) => {
                format!("Element {t} is out of range that can be calculated")
            }
            RequirementError::FromTo(a, b) => format!("{a} is bigger than {b}"),
            RequirementError::None(t) => format!("Data field {t} is None"),
        };
        write!(f, "{}", err)
    }
}

/// Error concering the tauri runtime, should stop the application from
/// continuing
#[derive(Serialize, Deserialize, Debug)]
pub enum TauriError {
    /// can't find the file specified in the import filepath
    ImportPath(String),
    /// struct in the import file doesn't fit ImportChunk
    ImportStruct(String),
    Export,
    UnitModification,
}

/// Error concerning validatino of data, should amend the data and not stop the
/// application
#[derive(Serialize, Deserialize, PartialEq, Debug)]
pub enum ValidationError {
    UnitName,
    SkillLevel,
    Algorithm(Vec<(AlgoCategory, Vec<usize>)>),
    ForeignAlgo(Vec<(Algorithm, AlgoCategory)>),
    ForeignMainStat((AlgoMainStat, AlgoCategory)),
}
