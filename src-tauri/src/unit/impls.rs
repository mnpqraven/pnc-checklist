use super::types::*;
use crate::{algorithm::types::AlgoPiece, stats::types::*};

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

    /// Returns a vector of AlgoPiece by checking unit's `current` and `goal`
    /// Loadout struct
    pub fn get_missing_algos(&self) -> Vec<AlgoPiece> {
        let mut v = self.goal.algo.clone();
        v.update_slots(self.current.algo.get_bucket());
        v.get_bucket()
    }

    pub fn get_current_algos(&self) -> Vec<AlgoPiece> {
        let mut v = Vec::new();
        let a = self.current.algo.offense.clone();
        let b = self.current.algo.stability.clone();
        let c = self.current.algo.special.clone();
        v.extend(a);
        v.extend(b);
        v.extend(c);
        v
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
