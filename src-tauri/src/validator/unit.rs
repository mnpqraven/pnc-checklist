use super::UnitValidationError;
use crate::model::structs::Unit;

pub fn validate_unit_name(unit: &Unit) -> Result<(), UnitValidationError> {
    match unit.name.is_empty() {
        true =>  Err(UnitValidationError::Name),
        false => Ok(())
    }
}
