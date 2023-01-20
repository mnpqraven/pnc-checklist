use self::{algo::validate_algo, unit::validate_unit_name};
use crate::{
    algorithm::types::{AlgoPiece, AlgoSlot},
    model::error::ValidationError,
    unit::types::Unit,
};

mod algo;
#[cfg(test)]
mod bacon;
mod inputs;
mod unit;

/// Trait that is implemented to all user-inputtable data and checks for
/// irregularities
/// If the data is valid, will return None (as in no changes needed)
/// If the data is not valid, will try to return the closest acceptable data
/// If the data is not valid but the backend can't suggest a fixable
/// alternative, return `ValidationError`
pub trait ValidData<T> {
    type U;
    fn input_validate<U>(&self) -> Result<Option<T>, ValidationError>;
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

#[tauri::command]
pub fn validate_slots(piece: AlgoPiece) -> Result<Option<AlgoSlot>, ValidationError> {
    piece.input_validate::<AlgoSlot>()
}
