use crate::model::structs::{ResourceByDay, Day, Algorithm};
use super::consts::BONUS_TABLE;

impl ResourceByDay {
    pub fn get_bonuses(day: Day) -> Self {
        unsafe {
            Self {
                day,
                coin: BONUS_TABLE.get_unchecked(day as usize)[0],
                exp: BONUS_TABLE.get_unchecked(day as usize)[1],
                skill: BONUS_TABLE.get_unchecked(day as usize)[2],
                class: BONUS_TABLE.get_unchecked(day as usize)[3],
                algos: Algorithm::get_bonuses(day),
            }
        }
    }
}