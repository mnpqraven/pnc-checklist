//! handles building stucts like unit, algos, resources
//!

use crate::{
    model::{impls::update_reqs, infomodel::*},
    parser::calc::GrandResource,
    startup::Storage,
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
            goal: Loadout::new(true),
        }
    }
}

#[tauri::command]
pub fn update_chunk(chunk: ImportChunk, store: State<Storage>) -> Result<(), &'static str> {
    let mut store = store.store.lock().unwrap();
    *store = chunk;
    Ok(())
}
#[tauri::command]
pub fn view_store_units(store: State<Storage>) -> Vec<Unit> {
    let guard = store.store.lock().unwrap();
    let list: Vec<String> = guard.units.iter().map(|e| e.name.clone()).collect();
    println!("{:?}", list);
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
pub fn save_unit(unit: Unit, index: usize, store: State<'_, Storage>) -> Result<usize, ()> {
    println!("[invoke] save_unit");
    let mut guard = store.store.lock().unwrap(); // needs mutable lock
    let units = &mut guard.units;
    units[index] = unit;
    drop(guard);

    println!("{}", index);
    update_reqs(store).unwrap();
    Ok(index)
}
#[tauri::command]
pub fn save_units(units: Vec<(Unit, usize)>, store: State<'_, Storage>) -> Result<Vec<usize>, &'static str> {
    println!("[invoke] save_units");
    let mut guard = store.store.lock().unwrap();
    for (unit, index) in units.iter() {
        guard.units[*index] = unit.clone();
    }
    drop(guard);
    update_reqs(store).unwrap();

    let edited: Vec<usize> = units.iter().map(|e| e.1).collect();
    Ok(edited)
}

#[tauri::command]
pub fn get_needed_rsc(store: State<Storage>) -> GrandResource {
    let guard_req = store.database_req.lock().unwrap();
    let (mut slv_token, mut slv_pivot, mut coin) = (0, 0, 0);
    for req in guard_req.unit_req.iter() {
        slv_pivot += req.skill.pivot;
        slv_token += req.skill.token;
        coin += req.skill.coin;
    }

    let t = GrandResource {
        slv_token,
        slv_pivot,
        coin,
    };
    println!("{:?}", t);
    t
}

#[cfg(test)]
mod tests {
    use crate::model::infomodel::*;

    #[test]
    fn add_display() {
        let unit = Unit::new("Hubble".to_string(), Class::Sniper);
        println!("{:?}", unit)
    }
}
