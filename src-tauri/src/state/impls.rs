use super::types::{Computed, GrandResource, JSONStorage, Keychain, KeychainTable, UserJSON};
use crate::algorithm::types::IAlgoPiece;
use crate::service::errors::TauriError;
use crate::stats::types::*;
use crate::unit::types::{Class, IUnit};
use crate::{
    requirement::types::{DatabaseRequirement, UnitRequirement},
    service::file::import,
};
use std::path::Path;
use std::sync::{Arc, Mutex, MutexGuard};
use strum::IntoEnumIterator;
use tauri::api::path::data_dir;

impl Default for UserJSON {
    // TODO: separate import handler, test on windows first
    fn default() -> Self {
        import(
            Path::new(
                &data_dir()
                    .unwrap()
                    .join("PNCChecklist")
                    .join("pnc_database.json"),
            )
            .to_str()
            .unwrap()
            .to_owned(),
        )
        .unwrap()
    }
}
#[cfg(test)]
mod tests {
    use crate::{
        algorithm::types::IAlgoSet,
        loadout::types::LoadoutType,
        stats::types::{NeuralFragment, IUnitSkill},
        unit::types::{ILoadout, IUnit},
    };

    #[test]
    fn serde() {
        let lo_current: ILoadout = ILoadout {
            loadout_type: LoadoutType::Current,
            skill_level: IUnitSkill::max(),
            level: crate::stats::types::ILevel(30),
            algo: IAlgoSet::new(true),
            neural: crate::unit::types::NeuralExpansion::OneHalf,
            frags: NeuralFragment(Some(9)),
        };
        let mut lo_goal = lo_current.clone();
        lo_goal.loadout_type = LoadoutType::Goal;
        lo_goal.frags = NeuralFragment(None);

        let u: IUnit = IUnit {
            name: "Croque".to_string(),
            class: crate::unit::types::Class::Guard,
            current: lo_current,
            goal: lo_goal,
        };
        let t = serde_json::to_string_pretty::<IUnit>(&u).unwrap();
        for line in t.split('\n') {
            println!("{}", line);
        }
    }
}

impl Default for JSONStorage {
    /// NOTE: will be called during tauri's `manage` at startup
    fn default() -> Self {
        let store: Mutex<UserJSON> = Mutex::new(Default::default());
        let db: Mutex<GrandResource> = Mutex::new(Default::default());

        Self { store, db }
    }
}

impl KeychainTable {
    /// NOTE: important: using initialized store to produce `Arc`s
    /// AlgoPiece will always be cloned, will be separated with the AlgoPiece
    /// in each unit and therefore need a dedicated update function
    pub fn inject(store: Vec<IUnit>) -> (Self, Vec<Arc<Mutex<IUnit>>>) {
        // arc mutex option unit
        let mut keychains: Vec<Keychain> = Vec::new();
        let mut am_units: Vec<Arc<Mutex<IUnit>>> = Vec::new();
        for unit in store.iter() {
            let am_unit: Arc<Mutex<IUnit>> = Arc::new(Mutex::new(unit.clone()));
            am_units.push(Arc::clone(&am_unit));

            for algo in unit.current.get_algos().into_iter() {
                let am_algo: Arc<Mutex<IAlgoPiece>> = Arc::new(Mutex::new(algo.clone()));

                keychains.push(Keychain::new(&Arc::clone(&am_unit), &am_algo));
            }
        }
        let keychains = Mutex::new(keychains);
        (Self { keychains }, am_units)
    }

    /// Update the keychain table by finding all keys with the provided `Unit`
    /// (that should be already updated) and replace found keys with new data
    /// from the `Unit`
    ///
    /// * `g_kcs`: the mutex guard for the `Vec<Keychain>`
    /// * `unit`: `Unit` that will have its data replaced by its new value
    pub fn update_keychain(mut g_kcs: MutexGuard<Vec<Keychain>>, am_unit: &Arc<Mutex<IUnit>>) {
        println!("update_keychain");

        // will be finding unit using `Weak`
        let unit = &Arc::downgrade(am_unit);

        // INFO: discard current keychains tied to the unit
        g_kcs.retain(|e| !e.unit.ptr_eq(unit));

        // INFO: append new keychains
        let g_unit = am_unit.lock().unwrap();
        for algo in g_unit.current.get_algos().into_iter() {
            let am_algo: &Arc<Mutex<IAlgoPiece>> = &Arc::new(Mutex::new(algo.clone()));
            g_kcs.push(Keychain::new(am_unit, am_algo));
        }
    }

    /// Assigns a new keychain, linking a holder of the keychain (`Unit`) and
    /// its contents (slice of `AlgoPiece` for now)
    ///
    /// * `unit`:
    /// * `lockers`:
    pub fn assign(&self, am_unit: &Arc<Mutex<IUnit>>, am_lockers: &[Arc<Mutex<IAlgoPiece>>]) {
        for am_locker in am_lockers.iter() {
            self.keychains
                .lock()
                .unwrap()
                .push(Keychain::new(am_unit, am_locker));
        }
    }
}

impl DatabaseRequirement {
    /// Generate a new `DatabaseRequirement`, having all neccesary requiring
    /// parameters in `GrandResource` from the provided units
    ///
    /// * `units`: list of units. If only `Unit` without an Arc wrapper, try to
    /// use `Arc::clone()` instead of `Arc::new()`
    pub fn process_list(units: Vec<IUnit>) -> Result<Self, TauriError> {
        println!("process_list");
        let unit_req: Vec<UnitRequirement> = units
            .iter()
            .map(UnitRequirement::update_unit_req)
            .collect::<Result<Vec<UnitRequirement>, TauriError>>(
        )?;
        dbg!(&unit_req);
        Ok(Self { unit_req })
    }
}

impl GrandResource {
    /// Combines with another `GrandResource`, appending all values from the
    /// other to self. This works the same as `Vec::append()`
    pub fn combine(&mut self, with: Self) {
        let mut widgets: Vec<WidgetResource> = Vec::new();
        let coin = self.coin.0 + with.coin.0;
        for class in Class::iter() {
            let in_self = self.widgets.iter().find(|e| e.class == class);
            let in_with = with.widgets.iter().find(|e| e.class == class);
            let widget_inventory: [u32; 6] = match (in_self, in_with) {
                (Some(a), Some(b)) => {
                    let mut sum: [u32; 6] = [0; 6];
                    for (index, _) in (0..6).enumerate() {
                        sum[index] = a.widget_inventory[index] + b.widget_inventory[index];
                    }
                    sum
                }
                (Some(a), None) => a.widget_inventory,
                (None, Some(b)) => b.widget_inventory,
                (None, None) => [0; 6],
            };
            widgets.push(WidgetResource {
                class,
                widget_inventory,
            })
        }
        *self = Self {
            skill: SkillCurrency {
                token: self.skill.token + with.skill.token,
                pivot: self.skill.pivot + with.skill.pivot,
            },
            coin: Coin(coin),
            widgets,
            exp: Exp(self.exp.0 + with.exp.0),
            neural_kits: self.neural_kits + with.neural_kits,
        };
    }
}

impl Computed {
    // only update the units field for now
    pub fn to_user_json(&self, current: &UserJSON) -> UserJSON {
        // NOTE: for now lock inside helper fns need try block
        let lock = self.units.try_lock().unwrap();
        UserJSON {
            schema: current.schema.clone(),
            database: current.database.clone(),
            units: lock.iter().map(|c| c.lock().unwrap().clone()).collect(),
        }
    }
}

impl Keychain {
    /// Creates a new `Keychain`, holding a `Weak` reference to unit
    ///
    /// * `unit`: Unit inside an `Arc<Mutex<T>>` that will be downgraded with
    /// `Weak`, so that the keychain owner can be `None` if the unit is deleted
    /// * `piece`:
    pub fn new(am_unit: &Arc<Mutex<IUnit>>, am_piece: &Arc<Mutex<IAlgoPiece>>) -> Self {
        Self {
            unit: Arc::downgrade(am_unit),
            locker: Arc::clone(am_piece),
        }
    }

    pub fn eq_locker_piece(&self, with: &Self) -> bool {
        let left = &self.locker.lock().unwrap().name;
        let right = &with.locker.lock().unwrap().name;
        dbg!(&left, &right, left.eq(right));
        left.eq(right)
    }
}
