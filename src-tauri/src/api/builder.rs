//! handles building stucts like unit, algos, resources
//!

use tauri::State;

use crate::{model::infomodel::*, startup::Storage};

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
pub fn save_unit(unit: Unit, index: usize, store: State<Storage>) -> Result<usize, ()> {
    println!("[invoke] save_unit");
    let mut guard = store.store.lock().unwrap(); // needs mutable lock
    let units = &mut guard.units;
    units[index] = unit;
    println!("{}", index);
    Ok(index)
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
