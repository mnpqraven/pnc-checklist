use crate::model::error::ValidationError;
use crate::validator::*;
use crate::{
    stats::types::*,
    table::consts::{VALID_LEVEL_MAX, VALID_LEVEL_MIN},
};

impl ValidData for Level {
    fn input_validate(&mut self) -> Result<(), ValidationError> {
        match self.0 {
            x if x < VALID_LEVEL_MIN => self.0 = VALID_LEVEL_MIN,
            x if x > VALID_LEVEL_MAX => self.0 = VALID_LEVEL_MAX,
            _ => {}
        }
        Ok(())
    }
}

impl ValidData for UnitSkill {
    fn input_validate(&mut self) -> Result<(), ValidationError> {
        fn helper_bound(x: &mut u32) -> Result<(), ValidationError> {
            match *x {
                t if t < 1 => *x = 1,
                t if t > 10 => *x = 10,
                _ => {}
            }
            Ok(())
        }
        helper_bound(&mut self.auto)?;
        helper_bound(&mut self.passive)?;
        Ok(())
    }
}

impl ValidData for Coin {
    fn input_validate(&mut self) -> Result<(), ValidationError> {
        Ok(())
    }
}
