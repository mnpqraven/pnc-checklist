use crate::model::builder::default_slot_size;

use super::infomodel::{AlgoCategory, Class, Unit};

/// NOTE: for now validate algo integrity when changing unit class
/// only validate current set, goal TBA
/// error case returns the type of the algo that contains error (offense, stablility, special)
/// usize is the index of the error
// TODO: finish other 2 + refactor
#[tauri::command]
pub fn validate_algo(unit: Unit) -> Result<(), Vec<(AlgoCategory, usize)>> {
    println!("validate_algo");
    let mut errs: Vec<(AlgoCategory, usize)> = Vec::new();

    let size: usize = default_slot_size(unit.class, AlgoCategory::Stability);
    for (index, item) in unit.current.algo.stability.iter().enumerate() {
        let trues: usize = item.slot.iter().filter(|e| **e).count();
        if trues > size {
            println!("TODO: err, trues: {}, slot_size: {}", trues, size);
            errs.push((AlgoCategory::Stability, index));
        }
    }
    match errs.is_empty() {
        true => Ok(()),
        false => Err(errs),
    }
}
