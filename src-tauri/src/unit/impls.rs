use super::types::*;
use crate::{algorithm::types::AlgoPiece, model::error::TauriError, stats::types::*};
use std::sync::{Arc, Mutex};

// UNIT
impl Unit {
    pub fn new(name: String, class: Class) -> Self {
        Self {
            name,
            class,
            current: Loadout::new(false, false),
            goal: Loadout::new_goal(),
        }
    }

    /// Returns a vector of AlgoPiece by checking unit's `current` and `goal`
    /// Loadout struct
    // TODO: return vec of references
    pub fn get_missing_algos(&self) -> Vec<AlgoPiece> {
        let mut v = self.current.algo.clone();
        v.apply_checkbox(self.goal.algo.get_bucket());
        v.get_bucket()
    }

    /// creates a `Vec` of new `Arc<Mutex<T>>>` for lockers that should belong to
    /// this `Unit`
    pub fn create_lockers(
        am_unit: &Arc<Mutex<Unit>>,
    ) -> Result<Vec<Arc<Mutex<AlgoPiece>>>, TauriError> {
        if let Ok(g_unit) = am_unit.lock() {
            Ok(g_unit
                .current
                .get_algos()
                .into_iter()
                .cloned()
                .map(|e| Arc::new(Mutex::new(e)))
                .collect())
        } else {
            Err(TauriError::RequestLockFailed)
        }
    }
}

impl Default for NeuralExpansion {
    fn default() -> Self {
        Self::Three
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
    pub fn max() -> Self {
        Self {
            passive: 10,
            auto: 10,
        }
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

impl Level {
    pub fn max() -> Self {
        Self(70)
    }
}
