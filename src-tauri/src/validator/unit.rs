use super::ValidationError;
use crate::unit::types::Unit;

pub fn validate_unit_name(unit: &Unit) -> Result<(), ValidationError> {
    match unit.name.is_empty() {
        true => Err(ValidationError::UnitName),
        false => Ok(()),
    }
}
