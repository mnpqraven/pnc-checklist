use crate::service::errors::ValidationError;
use crate::validator::*;
use crate::{
    stats::types::*,
    table::consts::{VALID_LEVEL_MAX, VALID_LEVEL_MIN},
};

impl ValidData<ILevel> for ILevel {
    type U = ILevel;
    fn input_validate<U>(&self) -> Result<Option<ILevel>, ValidationError> {
        match self.0 {
            x if x < VALID_LEVEL_MIN => Ok(Some(ILevel(VALID_LEVEL_MIN))),
            x if x > VALID_LEVEL_MAX => Ok(Some(ILevel(VALID_LEVEL_MAX))),
            _ => Ok(None),
        }
    }
}

impl ValidData<IUnitSkill> for IUnitSkill {
    type U = IUnitSkill;
    fn input_validate<U>(&self) -> Result<Option<IUnitSkill>, ValidationError> {
        fn helper_bound(x: &u32) -> Option<u32> {
            match *x {
                t if t < 1 => Some(1),
                t if t > 10 => Some(10),
                _ => None,
            }
        }
        let a = helper_bound(&self.passive);
        let b = helper_bound(&self.auto);
        match (a, b) {
            (None, None) => Ok(None),
            (None, Some(y)) => Ok(Some(IUnitSkill {
                passive: self.passive,
                auto: y,
            })),
            (Some(x), None) => Ok(Some(IUnitSkill {
                passive: x,
                auto: self.auto,
            })),
            (Some(x), Some(y)) => Ok(Some(IUnitSkill {
                passive: x,
                auto: y,
            })),
        }
    }
}

impl ValidData<Coin> for Coin {
    type U = Coin;
    fn input_validate<U>(&self) -> Result<Option<Coin>, ValidationError> {
        Ok(None)
    }
}

impl NeuralFragment {
    pub fn new(value: Option<i32>) -> Self {
        match value {
            Some(num) => Self(Some(num as u32)),
            None => Self(None)
        }
    }
}
