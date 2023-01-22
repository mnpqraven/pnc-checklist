use super::ValidData;
use crate::{algorithm::types::*, validator::ValidationError};

impl ValidData<AlgoPiece> for AlgoSet {
    type U = AlgoSet;
    /// Ensures algos are in the right category
    fn input_validate<U>(&self) -> Result<Option<AlgoPiece>, ValidationError> {
        let cats = vec![&self.offense, &self.stability, &self.special];
        let list = vec![
            AlgoTypeDb::get_algo(AlgoCategory::Offense),
            AlgoTypeDb::get_algo(AlgoCategory::Stability),
            AlgoTypeDb::get_algo(AlgoCategory::Special),
        ];
        let mut errs = Vec::new();
        for (ind, cat) in cats.iter().enumerate() {
            for piece in cat.iter() {
                if !list.get(ind).unwrap().algos.contains(&piece.name) {
                    errs.push((piece.name.to_owned(), list.get(ind).unwrap().category))
                }
            }
        }
        match errs.is_empty() {
            true => Ok(None),
            false => Err(ValidationError::ForeignAlgo(errs)),
        }
    }
}

impl ValidData<AlgoMainStat> for AlgoPiece {
    type U = AlgoMainStat;
    /// Ensures the right main stats are placed in the algo
    fn input_validate<U>(&self) -> Result<Option<AlgoMainStat>, ValidationError> {
        // checking name + stat
        let cat = self.name.get_category();

        match cat.get_mainstat().contains(&self.stat) {
            // NOTE: fallback
            // println!("VALIDATION ERROR: USING DEFAULT");
            // self.stat = AlgoMainStat::default(&cat);
            false => Err(ValidationError::ForeignMainStat((self.stat.clone(), cat))),
            true => Ok(None),
        }
    }
}

impl ValidData<AlgoSlot> for AlgoPiece {
    type U = AlgoSlot;
    /// Ensures the right slots and their assignments are correct in the algo
    fn input_validate<U>(&self) -> Result<Option<AlgoSlot>, ValidationError> {
        let next_slot = AlgoPiece::compute_slots(&self.name, &self.slot);
        match self.slot.eq(&next_slot) {
            false => Ok(Some(next_slot)),
            _ => Ok(None)
        }
    }
}
