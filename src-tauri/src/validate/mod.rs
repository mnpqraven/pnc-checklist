use serde::{Deserialize, Serialize};

use crate::model::infomodel::{AlgoCategory, Unit};

use self::{algo::validate_algo, unit::validate_unit_name};

mod algo;
mod unit;

#[derive(Serialize, Deserialize, PartialEq, Debug)]
pub enum UnitValidationError {
    NameError,
    SkillLevelError,
    AlgorithmError(Vec<(AlgoCategory, Vec<usize>)>),
}

#[derive(Serialize, Deserialize, Debug)]
pub enum TauriError {
    ImportPathError(String),
    ImportStructError(String),
    ExportError,
}
// TODO: skill level boundary check

#[tauri::command]
pub fn validate(unit: Option<Unit>) -> Result<(), Vec<UnitValidationError>> {
    let mut errs: Vec<UnitValidationError> = Vec::new();
    if let Some(unit) = unit {
        match validate_unit_name(&unit) {
            Ok(()) => {},
            Err(e) => errs.push(e)
        }
        match validate_algo(&unit) {
            Ok(())=> {},
            Err(e) => errs.push(e)
        }
    }
    if !errs.is_empty() {
        return Err(errs)
    }
    Ok(())
}
