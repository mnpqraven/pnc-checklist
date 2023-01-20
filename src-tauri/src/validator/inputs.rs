use super::ValidData;
use crate::{
    model::structs::{AlgoCategory, AlgoSet, Coin, Level, UnitSkill},
    table::consts::{ALGO_OFFENSE, ALGO_SPECIAL, ALGO_STABILITY, VALID_LEVEL_MAX, VALID_LEVEL_MIN},
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
        Ok(Coin(self.0))
    }
}

// TODO: needs impl for
// Set
// slot in piece according to name
impl ValidData for AlgoSet {
    type T = AlgoSet;

    fn input_validate(&self) -> Result<Self::T, super::ValidationError> {
        let cats = vec![&self.offense, &self.stability, &self.special];
        let list = vec![
            ALGO_OFFENSE.to_vec(),
            ALGO_STABILITY.to_vec(),
            ALGO_SPECIAL.to_vec(),
        ];
        for (ind, cat) in cats.iter().enumerate() {
            for piece in cat.into_iter() {
                if !list.get(ind).unwrap().contains(&piece.name) {
                    // handle not found
                }
            }
        }
        unimplemented!();
    }
}
