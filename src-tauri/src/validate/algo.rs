use super::UnitValidationError;
use crate::algorithm::default_slot_size;
use crate::model::enums::AlgoCategory;
use crate::model::structs::{algo_category_all, Unit};

/// NOTE: for now validate algo integrity when changing unit class
/// only validate current set, goal TBA
/// error case returns the type of the algo that contains error (offense, stablility, special)
/// usize is the index of the error
// TODO: finish other 2 + refactor
#[tauri::command]
pub fn validate_algo(unit: &Unit) -> Result<(), UnitValidationError> {
    println!("validate_algo");
    let mut errs: Vec<(AlgoCategory, Vec<usize>)> = Vec::new();

    for category in algo_category_all() {
        let size: usize = default_slot_size(unit.class, category);
        let mut index_bucket: Vec<usize> = Vec::new();

        let algo_set = match category {
            AlgoCategory::Offense => &unit.current.algo.offense,
            AlgoCategory::Stability => &unit.current.algo.stability,
            AlgoCategory::Special => &unit.current.algo.special,
        };

        for (index, item) in algo_set.iter().enumerate() {
            let trues: usize = item.slot.iter().filter(|e| **e).count();
            if trues > size {
                println!(
                    "TODO: err @ index {}, cat {:?}, item {:?}",
                    index, category, item
                );
                index_bucket.push(index)
            }
        }

        if !index_bucket.is_empty() {
            errs.push((category, index_bucket));
        }
    }
    match errs.is_empty() {
        true => Ok(()),
        false => Err(UnitValidationError::Algorithm(errs)),
    }
}
