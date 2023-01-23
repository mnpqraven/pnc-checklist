use super::types::{GrandResource, KeychainTable, Locker, Keychain, Storage, UserStore};
use crate::stats::types::*;
use crate::unit::types::{Class, Unit};
use crate::{
    requirement::types::{DatabaseRequirement, UnitRequirement},
    service::file::import,
};
use std::path::Path;
use std::sync::{Arc, Mutex, MutexGuard};
use strum::IntoEnumIterator;
use tauri::api::path::data_dir;

impl Default for UserStore {
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
impl Default for Storage {
    /// NOTE: will be called during tauri's `manage` at startup
    fn default() -> Self {
        let store: Mutex<UserStore> = Mutex::new(Default::default());
        let db: Mutex<GrandResource> = Mutex::new(Default::default());
        // userstore locker mutex
        let mut lockers: Vec<Locker> = Vec::new();
        // computed inv_table mutex
        let table = KeychainTable::get_current();
        let mut guardtable: MutexGuard<KeychainTable> = table.lock().unwrap();

        for unit in store.lock().unwrap().units.iter() {
            let locker = Locker(unit.current.get_algos());
            guardtable.append(&unit, &locker);
            lockers.push(locker);
        }

        Self {
            store,
            db,
            lockers: Mutex::new(lockers),
        }
    }
}

impl Default for DatabaseRequirement {
    fn default() -> Self {
        let store: UserStore = UserStore::default();
        // not used yet
        let _db: GrandResource = GrandResource::default();
        let mut reqs: Vec<UnitRequirement> = Vec::new();
        for unit in store.units.iter() {
            // TODO: test
            reqs.push(UnitRequirement::update_unit_req(unit))
        }
        Self { unit_req: reqs }
    }
}

impl GrandResource {
    pub fn new() -> Self {
        Self {
            skill: SkillCurrency { token: 0, pivot: 0 },
            coin: Coin(0),
            widgets: Vec::new(),
            exp: Exp(0),
            neural_kits: 0,
        }
    }
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

thread_local! {
    pub static CURRENT_INV_TABLE: Arc<Mutex<KeychainTable>> = Arc::new(Mutex::new(Default::default()));
}
impl KeychainTable {
    /// Get the inventory table with an ArcMutex lock
    pub fn get_current() -> Arc<Mutex<KeychainTable>> {
        CURRENT_INV_TABLE.with(|c| c.clone())
    }

    // TODO: find use case
    pub fn _set_current(self) {
        CURRENT_INV_TABLE.with(|c| *c.lock().unwrap() = self)
    }

    pub fn append(&mut self, unit: &Unit, locker: &Locker) {
        self.keychains.push(Keychain {
            owner: Arc::new(unit.clone()),
            locker: Arc::new(locker.clone()),
        })
    }

    pub fn _remove() { // TODO:
    }
}
