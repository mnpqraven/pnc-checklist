use self::{algo::validate_algo, unit::validate_unit_name};
use crate::model::{error::UnitValidationError, structs::Unit};

mod algo;
mod unit;
mod inputs;
#[cfg(test)]
mod bacon;

enum ValidationError {
    General,
    ApplyError
}

/// Trait that is implemented to all user-inputtable data and checks for
/// irregularities
/// If the data is valid, will return itself
/// If the data is not valid, will try to return the closest acceptable data,
/// other will return `ValidationError`
trait ValidData {
    type T;
    fn input_validate(&self) -> Result<Self::T, ValidationError>;
}

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
