use self::types::{Day, ResourceByDay};
use crate::algorithm::types::{Algorithm, AlgoCategory};

pub mod consts;
mod impls;
pub mod types;

#[tauri::command]
pub fn generate_algo_db() -> Vec<(AlgoCategory, Vec<Algorithm>)> {
    AlgoCategory::generate_algo_db()
}

#[tauri::command]
pub fn get_bonuses(day: Day) -> ResourceByDay {
    ResourceByDay::get_bonuses(day)
}

#[tauri::command]
pub fn get_algo_by_days(day: Day) -> Option<Vec<Algorithm>> {
    Algorithm::get_bonuses(day)
}
