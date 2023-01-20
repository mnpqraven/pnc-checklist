use self::types::*;
use crate::table::types::Day;
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
pub fn algo_set_new() -> AlgoSet {
    AlgoSet::new()
}

#[tauri::command]
pub fn algo_piece_new(category: AlgoCategory) -> AlgoPiece {
    AlgoPiece::new(category)
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
pub fn get_algo_by_days(day: Day) -> Option<Vec<Algorithm>> {
    Algorithm::get_bonuses(day)
}

#[tauri::command]
pub fn main_stat_all() -> Vec<AlgoMainStat> {
    vec![
        AlgoMainStat::Hashrate,
        AlgoMainStat::HashratePercent,
        AlgoMainStat::Atk,
        AlgoMainStat::AtkPercent,
        AlgoMainStat::Health,
        AlgoMainStat::HealthPercent,
        AlgoMainStat::Haste,
        AlgoMainStat::CritRate,
        AlgoMainStat::CritDmg,
        AlgoMainStat::DamageInc,
        AlgoMainStat::Dodge,
        AlgoMainStat::HealInc,
        AlgoMainStat::DamageReduction,
        AlgoMainStat::Def,
        AlgoMainStat::DefPercent,
        AlgoMainStat::OperandDef,
        AlgoMainStat::OperandDefPercent,
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
