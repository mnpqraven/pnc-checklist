//! handles building stucts like unit, algos, resources
//!

use tauri::State;

use crate::startup::{import_userdata, Storage};

use super::infomodel::{AlgoCategory, AlgoPiece, AlgoSet, Class, Loadout, Unit, UnitSkill};

#[tauri::command]
pub fn default_slot_vec(class: Class, category: AlgoCategory) -> Vec<u32> {
    match class {
        Class::Guard if category == AlgoCategory::Stability => vec![1, 2, 3],
        Class::Warrior | Class::Sniper if category == AlgoCategory::Offense => vec![1, 2, 3],
        Class::Specialist | Class::Medic if category == AlgoCategory::Special => vec![1, 2, 3],
        _ => vec![1, 2],
    }
}

// UNIT
impl Unit {
    fn new(name: String, class: Class) -> Self {
        Self {
            name,
            class: class.to_owned(),
            current: Loadout::new(class),
            goal: Loadout::new(class),
        }
    }
}
#[tauri::command]
pub fn view_store_units(store: State<Storage>) -> Vec<Unit> {
    let guard = store.store.lock().unwrap();
    guard.units.clone()
}
#[tauri::command]
pub fn new_unit(name: String, class: Class, store: State<Storage>) -> Unit {
    let new_unit = Unit::new(name, class);
    let mut guard = store.store.lock().unwrap();
    guard.units.push(new_unit.clone());
    new_unit
}

// FIX: not working
#[tauri::command]
pub fn save_unit(unit: Unit, index: usize, store: State<Storage>) -> Result<usize, ()> {
    // TODO: store json data inside app and get later
    // probably using struct method
    // FIX:
    println!("save_unit()");
    let mut guard = store.store.lock().unwrap(); // needs mutable lock
    let units = &mut guard.units;
    units[index] = unit;
    Ok(index)
}

// LOADOUT
impl Loadout {
    fn new(class: Class) -> Self {
        Self {
            skill_level: Some(UnitSkill {
                passive: 1,
                auto: 1,
            }),
            algo: AlgoSet::new(class),
        }
    }
}
// ALGOS
impl AlgoSet {
    fn new(class: Class) -> Self {
        Self {
            offense: vec![AlgoPiece::new(default_slot_vec(
                class,
                AlgoCategory::Offense,
            ))],
            stability: vec![AlgoPiece::new(default_slot_vec(
                class,
                AlgoCategory::Stability,
            ))],
            special: vec![AlgoPiece::new(default_slot_vec(
                class,
                AlgoCategory::Special,
            ))],
        }
    }
}
#[tauri::command]
pub fn algo_set_new(class: Class) -> AlgoSet {
    AlgoSet::new(class)
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
