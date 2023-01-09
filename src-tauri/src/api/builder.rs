//! handles building stucts like unit, algos, resources
//!
use crate::{
    model::{enums::*, error::TauriError, impls::update_reqs, structs::*},
    parser::file::localsave,
    state::{Computed, Storage},
};
use tauri::State;

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
pub fn algo_slots_compute(name: Algorithm, current_slots: Vec<bool>) -> Vec<bool> {
    AlgoPiece::compute_slots(name, current_slots)
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

// UNIT
impl Unit {
    fn new(name: String, class: Class) -> Self {
        Self {
            name,
            class,
            current: Loadout::new(false),
            goal: Loadout::new_goal(),
        }
    }
}

#[tauri::command]
pub fn update_chunk(chunk: UserStore, store: State<Storage>) -> Result<(), &'static str> {
    let mut store = store.store.lock().unwrap();
    *store = chunk;
    Ok(())
}
#[tauri::command]
pub fn view_store_units(store: State<Storage>) -> Vec<Unit> {
    let guard = store.store.lock().unwrap();
    // debugging
    let _list: Vec<String> = guard.units.iter().map(|e| e.name.clone()).collect();
    guard.units.clone()
}
#[tauri::command]
pub fn new_unit(name: String, class: Class, store: State<Storage>) -> Unit {
    let new_unit = Unit::new(name, class);
    let mut guard = store.store.lock().unwrap();
    guard.units.push(new_unit.clone());
    new_unit
}
#[tauri::command]
pub fn delete_unit(index: usize, store: State<Storage>) -> Result<(), TauriError> {
    let mut guard = store.store.lock().unwrap();
    if index < guard.units.len() {
        guard.units.remove(index);
        Ok(())
    } else {
        Err(TauriError::UnitModification)
    }
}

#[tauri::command]
pub fn save_units(
    units: Vec<(Unit, usize)>,
    store: State<'_, Storage>,
    computed: State<'_, Computed>,
) -> Result<Vec<usize>, &'static str> {
    println!("[invoke] save_units");
    let mut guard = store.store.lock().unwrap();
    for (unit, index) in units.iter() {
        guard.units[*index] = unit.clone();
    }
    update_reqs(&guard, computed).unwrap();
    localsave(&guard).unwrap();

    let edited: Vec<usize> = units.iter().map(|e| e.1).collect();
    Ok(edited)
}

#[tauri::command]
pub fn get_needed_rsc(computed: State<'_, Computed>) -> GrandResource {
    let guard_req = computed.database_req.lock().unwrap();
    // let (mut token, mut pivot, mut coin) = (0, 0, 0);
    // for req in guard_req.unit_req.iter() {
    //     pivot += req.skill.pivot;
    //     token += req.skill.token;
    //     coin += req.skill.coin.0;
    // }

    // // TODO: fill other fields
    // let t = GrandResource {
    //     skill: SkillCurrency { token, pivot },
    //     coin: Coin(coin),
    //     ..Default::default()
    // };
    // println!("{:?}", t);
    // t
    let t = guard_req.generate_resource();
    println!("{:?}", t);
    t
}

#[tauri::command]
pub fn generate_algo_db() -> Vec<AlgoTypeDb> {
    AlgoTypeDb::generate_algo_db()
}
#[tauri::command]
pub fn get_algo_by_days(day: Day) -> Option<Vec<Algorithm>> {
    Algorithm::get_bonuses(day)
}

#[tauri::command]
pub fn get_algo_types() -> Vec<AlgoTypeDb> {
    AlgoTypeDb::generate_algo_db()
}

#[tauri::command]
pub fn get_bonuses(day: Day) -> ResourceByDay {
    ResourceByDay::get_bonuses(day)
}

#[cfg(test)]
mod tests {
    use crate::model::enums::*;
    use crate::model::structs::*;

    #[test]
    fn add_display() {
        let unit = Unit::new("Hubble".to_string(), Class::Sniper);
        println!("{:?}", unit)
    }
}
