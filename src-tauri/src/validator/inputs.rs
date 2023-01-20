use super::ValidData;
use crate::{algorithm::types::*, validator::ValidationError};

impl ValidData for AlgoSet {
    fn input_validate(&mut self) -> Result<(), ValidationError> {
        let cats = vec![&self.offense, &self.stability, &self.special];
        let list = vec![
            AlgoTypeDb::get_algo(AlgoCategory::Offense),
            AlgoTypeDb::get_algo(AlgoCategory::Stability),
            AlgoTypeDb::get_algo(AlgoCategory::Special),
        ];
        let mut errs = Vec::new();
        for (ind, cat) in cats.iter().enumerate() {
            for piece in cat.into_iter() {
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
