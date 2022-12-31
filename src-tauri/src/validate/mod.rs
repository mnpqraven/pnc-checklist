use serde::{Serialize, Deserialize};

pub mod algo;
pub mod unit;

pub enum UnitValidationError {
    NameError,
    SkillLevelError,
    AlgorithmError
}

#[derive(Serialize, Deserialize, Debug)]
pub enum TauriError {
    ImportPathError(String),
    ImportStructError(String),
    ExportError
}
// TODO: skill level boundary check
