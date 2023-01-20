use self::types::{Day, ResourceByDay};
use crate::algorithm::types::AlgoTypeDb;

pub mod consts;
mod impls;
pub mod types;

#[tauri::command]
pub fn generate_algo_db() -> Vec<AlgoTypeDb> {
    AlgoTypeDb::generate_algo_db()
}

#[tauri::command]
pub fn get_bonuses(day: Day) -> ResourceByDay {
    ResourceByDay::get_bonuses(day)
}
