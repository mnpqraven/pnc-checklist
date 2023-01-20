use self::{algo::validate_algo, unit::validate_unit_name};
use crate::{model::error::ValidationError, unit::types::Unit};

mod algo;
#[cfg(test)]
mod bacon;
mod inputs;
mod unit;

/// Trait that is implemented to all user-inputtable data and checks for
/// irregularities
/// If the data is valid, will return itself
/// If the data is not valid, will try to transform into the closest acceptable
/// data, otherwise return `ValidationError`
pub trait ValidData {
    fn input_validate(&mut self) -> Result<(), ValidationError>;
}

#[tauri::command]
pub fn validate(unit: Option<Unit>) -> Result<(), Vec<ValidationError>> {
    let mut errs: Vec<ValidationError> = Vec::new();
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
