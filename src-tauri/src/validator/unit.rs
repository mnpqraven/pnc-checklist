use super::ValidationError;
use crate::unit::types::IUnit;

pub fn validate_unit_name(unit: &IUnit) -> Result<(), ValidationError> {
    match unit.name.is_empty() {
        true => Err(ValidationError::UnitName),
        false => Ok(()),
    }
}
