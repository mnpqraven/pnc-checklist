use crate::model::infomodel::Unit;
use super::UnitValidationError;

pub fn validate_unit_name(unit: Unit) -> Result<(), UnitValidationError>{
    if (1==1) {
        return Err(UnitValidationError::NameError);
    }
    Ok(())
}
