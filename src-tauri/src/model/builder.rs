//! handles building stucts like unit, algos, resources
//!

use crate::startup::import_userdata;

use super::infomodel::{
    AlgoCategory, AlgoPiece, AlgoSet, Class, ImportChunk, Loadout, Unit, UnitSkill, self,
};

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
pub fn new_unit(name: String, class: Class) -> Unit {
    Unit::new(name, class)
}
#[tauri::command]
pub fn save_unit(unit: Unit, index: usize) -> ( Vec<Unit>, usize ) {
    // TODO: store json data inside app and get later
    // probably using struct method
    let mut units: Vec<Unit> = import_userdata().units;
    match units.get(index) {
        #[allow(unused_variables)]
        Some(mut _value) => {
            _value = &unit;
            (units, index)
        }
        None => {
            units.push(unit);
            (units.clone(), units.len())
        }
    }
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

#[cfg(test)]
mod tests {
    use crate::model::infomodel::*;

    #[test]
    fn add_display() {
        let unit = Unit::new("Hubble".to_string(), Class::Sniper);
        println!("{:?}", unit)
    }
}
