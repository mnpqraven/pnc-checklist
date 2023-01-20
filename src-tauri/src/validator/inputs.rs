use super::ValidData;
use crate::{
    model::structs::Level,
    table::consts::{VALID_LEVEL_MAX, VALID_LEVEL_MIN},
};

impl ValidData for Level {
    type T = Level;

    fn input_validate(&self) -> Result<Level, super::ValidationError> {
        match self.0 {
            x if x < VALID_LEVEL_MIN => Ok(Level(VALID_LEVEL_MIN)),
            x if x > VALID_LEVEL_MAX => Ok(Level(VALID_LEVEL_MAX)),
            _ => Ok(*self),
        }
    }
}
