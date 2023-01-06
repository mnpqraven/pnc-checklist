use super::infomodel::AlgoCategory;
use serde::{Deserialize, Serialize};
use std::fmt::Display;

#[derive(Debug, Serialize, Deserialize)]
pub enum RequirementError<T> {
    OutOfBound(T),
    FromTo(T, T),
}

impl<T: Display> Display for RequirementError<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let err = match self {
            RequirementError::OutOfBound(t) => {
                format!("Element {t} is out of range that can be calculated")
            }
            RequirementError::FromTo(a, b) => format!("{a} is bigger than {b}"),
        };
        write!(f, "{}", err)
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub enum TauriError {
    /// can't find the file specified in the import filepath
    ImportPath(String),
    /// struct in the import file doesn't fit ImportChunk
    ImportStruct(String),
    Export,
}

#[derive(Serialize, Deserialize, PartialEq, Debug)]
pub enum UnitValidationError {
    Name,
    SkillLevel,
    Algorithm(Vec<(AlgoCategory, Vec<usize>)>),
}
