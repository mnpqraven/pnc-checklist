use super::ValidData;
use crate::{
    model::structs::{Level, UnitSkill, Coin},
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

impl ValidData for UnitSkill {
    type T = UnitSkill;

    fn input_validate(&self) -> Result<Self::T, super::ValidationError> {
        fn helper_bound(x: &mut u32) {
            match *x {
                t if t < 1 => *x = 1,
                t if t > 10 => *x = 10,
                _ => {}
            }
        }
        let mut auto = self.auto;
        let mut passive = self.passive;
        helper_bound(&mut auto);
        helper_bound(&mut passive);
        Ok(UnitSkill { passive, auto })
    }
}

impl ValidData for Coin {
    type T = Coin;

    fn input_validate(&self) -> Result<Self::T, super::ValidationError> {
        if self.0 < 0 {
            Ok(Coin(0))
        } else { Ok(Coin(self.0)) }
    }
}
