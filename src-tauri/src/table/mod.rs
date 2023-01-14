use crate::model::structs::{AlgoTypeDb, ResourceByDay, Day};

pub mod consts;
mod impls;

#[tauri::command]
pub fn generate_algo_db() -> Vec<AlgoTypeDb> {
    AlgoTypeDb::generate_algo_db()
}

#[tauri::command]
pub fn get_bonuses(day: Day) -> ResourceByDay {
    ResourceByDay::get_bonuses(day)
}
