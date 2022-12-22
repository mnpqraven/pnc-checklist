//! handles building stucts like unit, algos, resources
//!

use super::infomodel::{Class, AlgoCategory, Unit, Loadout, AlgoSet, UnitSkill, AlgoPiece, Algorithm};

pub fn default_slot_vec(class: Class, category: AlgoCategory) -> Vec<u32> {
    match class {
        Class::Guard if category == AlgoCategory::Stability => vec![1,2,3],
        Class::Warrior | Class::Sniper if category == AlgoCategory::Offense => vec![1,2,3],
        Class::Specialist | Class::Medic if category == AlgoCategory::Special => vec![1,2,3],
        _ => vec![1,2]
    }
}
pub fn default_slot_size(class: &Class, category: AlgoCategory) -> u32 {
    default_slot_vec(*class, category).len() as u32
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