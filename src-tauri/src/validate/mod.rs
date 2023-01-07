use self::{algo::validate_algo, unit::validate_unit_name};
use crate::model::{error::UnitValidationError, structs::Unit};

mod algo;
mod unit;

#[tauri::command]
pub fn validate(unit: Option<Unit>) -> Result<(), Vec<UnitValidationError>> {
    let mut errs: Vec<UnitValidationError> = Vec::new();
    if let Some(unit) = unit {
        match validate_unit_name(&unit) {
            Ok(()) => {}
            Err(e) => errs.push(e),
        }
        match validate_algo(&unit) {
            Ok(()) => {}
            Err(e) => errs.push(e),
        }
    }
    if !errs.is_empty() {
        return Err(errs);
    }
    Ok(())
}
