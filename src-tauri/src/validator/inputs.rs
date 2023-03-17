use super::ValidData;
use crate::{algorithm::types::*, validator::ValidationError};

impl ValidData<IAlgoPiece> for IAlgoSet {
    type U = IAlgoSet;
    /// Ensures algos are in the right category
    fn input_validate<U>(&self) -> Result<Option<IAlgoPiece>, ValidationError> {
        let cats = vec![&self.offense, &self.stability, &self.special];
        let list = AlgoCategory::get_algo_db();
        let mut errs = Vec::new();
        for (ind, cat) in cats.iter().enumerate() {
            for piece in cat.iter() {
                if !list.get(ind).unwrap().1.contains(&piece.name) {
                    errs.push((piece.name.to_owned(), list.get(ind).unwrap().0))
                }
            }
        }
        match errs.is_empty() {
            true => Ok(None),
            false => Err(ValidationError::ForeignAlgo(errs)),
        }
    }
}

impl ValidData<AlgoMainStat> for IAlgoPiece {
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

impl ValidData<IAlgoSlot> for IAlgoPiece {
    type U = IAlgoSlot;
    /// Ensures the right slots and their assignments are correct in the algo
    fn input_validate<U>(&self) -> Result<Option<IAlgoSlot>, ValidationError> {
        let next_slot = IAlgoPiece::compute_slots(&self.name, &self.slot);
        match self.slot.eq(&next_slot) {
            false => Ok(Some(next_slot)),
            _ => Ok(None)
        }
    }
}
