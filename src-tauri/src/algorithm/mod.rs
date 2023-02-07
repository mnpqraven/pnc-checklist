use self::types::*;
use crate::table::consts::{
    ALGO_MAINSTAT_OFFENSE, ALGO_MAINSTAT_SPECIAL, ALGO_MAINSTAT_STABILITY, ALGO_OFFENSE,
    ALGO_SPECIAL, ALGO_STABILITY,
};
use crate::unit::types::Class;

#[cfg(test)]
mod bacon;
mod impls;
pub mod types;

#[tauri::command]
pub fn algorithm_all() -> Vec<Algorithm> {
    Algorithm::all()
}

#[tauri::command]
pub fn algo_set_new(checked_slots: bool) -> AlgoSet {
    AlgoSet::new(checked_slots)
}

#[tauri::command]
pub fn algo_piece_new(category: AlgoCategory, checked_slots: bool) -> AlgoPiece {
    AlgoPiece::new(category, checked_slots)
}
#[tauri::command]
pub fn algo_slots_compute(name: Algorithm, current_slots: AlgoSlot) -> AlgoSlot {
    AlgoPiece::compute_slots(&name, &current_slots)
}

#[tauri::command]
pub fn default_slot_size(class: Class, category: AlgoCategory) -> usize {
    match class {
        Class::Guard if category == AlgoCategory::Stability => 3,
        Class::Warrior | Class::Sniper if category == AlgoCategory::Offense => 3,
        Class::Specialist | Class::Medic if category == AlgoCategory::Special => 3,
        _ => 2,
    }
}

#[tauri::command]
pub fn main_stat_all() -> Vec<Vec<AlgoMainStat>> {
    vec![
        ALGO_MAINSTAT_OFFENSE.to_vec(),
        ALGO_MAINSTAT_STABILITY.to_vec(),
        ALGO_MAINSTAT_SPECIAL.to_vec(),
    ]
}

#[tauri::command]
pub fn algo_category_all() -> Vec<AlgoCategory> {
    vec![
        AlgoCategory::Offense,
        AlgoCategory::Stability,
        AlgoCategory::Special,
    ]
}

#[tauri::command]
pub fn print_algo(payload: AlgoCategory) -> Vec<String> {
    let block: Vec<Algorithm> = match payload {
        AlgoCategory::Offense => ALGO_OFFENSE.to_vec(),
        AlgoCategory::Stability => ALGO_STABILITY.to_vec(),
        AlgoCategory::Special => ALGO_SPECIAL.to_vec(),
    };
    let t = block.iter().map(|f| f.to_string()).collect::<Vec<String>>();
    t
}

#[tauri::command]
/// args has to be set as `payload` for less confusion about naming schemes
/// across print methods
pub fn print_main_stat(payload: AlgoCategory) -> Vec<String> {
    let block: Vec<AlgoMainStat> = match payload {
        AlgoCategory::Offense => ALGO_MAINSTAT_OFFENSE.to_vec(),
        AlgoCategory::Stability => ALGO_MAINSTAT_STABILITY.to_vec(),
        AlgoCategory::Special => ALGO_MAINSTAT_SPECIAL.to_vec(),
    };
    let t = block.iter().map(|f| f.to_string()).collect::<Vec<String>>();
    t
}

#[tauri::command]
/// only prints out a single mainstat
pub fn dev_print_single_main(payload: AlgoMainStat) -> String {
    payload.to_string()
}
