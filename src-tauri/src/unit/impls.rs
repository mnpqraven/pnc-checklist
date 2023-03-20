use super::types::*;
use crate::algorithm::types::IAlgoPiece;
use crate::loadout::get_loadout_db;
use crate::loadout::types::LoadoutType;
use crate::prisma::{self, algo_piece, loadout, unit, unit_skill};
use crate::service::db::get_db;
use crate::stats::types::{ILevel, NeuralFragment, IUnitSkill};
use crate::traits::FromAsync;
use crate::unit::TauriError;
use std::str::FromStr;
use std::sync::{Arc, Mutex};

// UNIT
impl IUnit {
    pub fn new(name: String, class: Class) -> Self {
        Self {
            name,
            class,
            current: ILoadout::new(false, false),
            goal: ILoadout::new_goal(),
        }
    }

    /// Returns a vector of AlgoPiece by checking unit's `current` and `goal`
    /// Loadout struct
    // TODO: return vec of references
    pub fn get_missing_algos(&self) -> Vec<IAlgoPiece> {
        let mut v = self.current.algo.clone();
        v.apply_checkbox(self.goal.algo.get_bucket());
        v.get_bucket()
    }

    /// creates a `Vec` of new `Arc<Mutex<T>>>` for lockers that should belong to
    /// this `Unit`
    pub fn create_lockers(
        am_unit: &Arc<Mutex<IUnit>>,
    ) -> Result<Vec<Arc<Mutex<IAlgoPiece>>>, TauriError> {
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

impl FromAsync<unit::Data> for IUnit {
    async fn from_async(value: unit::Data) -> Self {
        let client = get_db().await;
        let unit_in_db = client
            .unit()
            .find_unique(unit::id::equals(value.id))
            .with(
                unit::loadouts::fetch(vec![])
                    .with(loadout::skill_level::fetch())
                    .with(loadout::algo::fetch(vec![]).with(algo_piece::slot::fetch(vec![]))),
            )
            .exec()
            .await
            .unwrap()
            .unwrap();
        let current = get_loadout_db(&unit_in_db, LoadoutType::Current)
            .expect("a Unit struct always have a current Loadout");
        let goal = get_loadout_db(&unit_in_db, LoadoutType::Goal)
            .expect("a Unit struct always have a goal Loadout");

        Self {
            name: value.name,
            class: Class::from_str(&value.class).unwrap(),
            current: ILoadout::from_async(current).await,
            goal: ILoadout::from_async(goal).await,
        }
    }
}

impl Default for NeuralExpansion {
    fn default() -> Self {
        Self::Three
    }
}

impl Default for ILevel {
    fn default() -> Self {
        Self(1)
    }
}

impl Default for NeuralFragment {
    fn default() -> Self {
        Self(Some(0))
    }
}

impl IUnitSkill {
    pub fn max() -> Self {
        Self {
            passive: 10,
            auto: 10,
        }
    }
}
impl FromAsync<unit_skill::Data> for IUnitSkill {
    async fn from_async(value: unit_skill::Data) -> Self {
        let client = get_db().await;
        let find = client
            .unit_skill()
            .find_unique(unit_skill::id::equals(value.id))
            .exec()
            .await
            .unwrap()
            .unwrap();
        Self {
            passive: find.passive as u32,
            auto: find.auto as u32,
        }
    }
}

impl Default for IUnitSkill {
    fn default() -> Self {
        Self {
            passive: 1,
            auto: 1,
        }
    }
}

impl ILevel {
    pub fn new(value: u32) -> Self {
        Self(value)
    }
    pub fn max() -> Self {
        Self(70)
    }
}
