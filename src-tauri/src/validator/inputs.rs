use super::ValidData;
use crate::{algorithm::types::*, validator::ValidationError};

impl ValidData for AlgoSet {
    /// Ensures algos are in the right category
    fn input_validate(&mut self) -> Result<(), ValidationError> {
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
            true => Ok(()),
            false => Err(ValidationError::ForeignAlgo(errs)),
        }
    }
}

impl ValidData for AlgoPiece {
    /// Ensures the right main stats are placed in the algo
    fn input_validate(&mut self) -> Result<(), ValidationError> {
        // INFO: checking name + stat
        let cat = self.name.get_category();

        match cat.get_mainstat().contains(&self.stat) {
            // NOTE: fallback
            // println!("VALIDATION ERROR: USING DEFAULT");
            // self.stat = AlgoMainStat::default(&cat);
            false => Err(ValidationError::ForeignMainStat((self.stat.clone(), cat))),
            true => Ok(()),
        }

        // INFO: checking slot
        // TODO: integration after examining frontend's hook
    }
}
