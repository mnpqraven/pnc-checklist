use crate::model::structs::{Level, Unit, Class, Loadout, UnitSkill, NeuralExpansion, NeuralFragment};

impl UnitSkill {
    pub fn new() -> Self {
        Self {
            passive: 1,
            auto: 1,
        }
    }
    pub fn max() -> Self {
        Self {
            passive: 10,
            auto: 10,
        }
    }
}

impl Level {
    pub fn max() -> Self {
        Self(70)
    }
}
// UNIT
impl Unit {
    pub fn new(name: String, class: Class) -> Self {
        Self {
            name,
            class,
            current: Loadout::new(false),
            goal: Loadout::new_goal(),
        }
    }
}
impl Default for NeuralExpansion {
    fn default() -> Self {
        Self::Two
    }
}
impl Default for UnitSkill {
    fn default() -> Self {
        Self {
            passive: 1,
            auto: 1,
        }
    }
}
impl Default for Level {
    fn default() -> Self {
        Self(1)
    }
}
impl Default for NeuralFragment {
    fn default() -> Self {
        Self(Some(0))
    }
}