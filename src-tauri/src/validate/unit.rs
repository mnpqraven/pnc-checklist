use super::UnitValidationError;
use crate::model::infomodel::Unit;

pub fn validate_unit_name(unit: &Unit) -> Result<(), UnitValidationError> {
    if unit.name.is_empty() {
        println!("debug: name is empty");
        return Err(UnitValidationError::NameError);
    }
    Ok(())
}
