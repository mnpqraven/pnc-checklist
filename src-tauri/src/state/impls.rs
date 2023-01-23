use super::types::{UserStore, GrandResource, Locker, LockerKeychain, CURRENT_INV_TABLE, InvTable};
use crate::stats::types::*;
use crate::unit::types::{Class, Unit};
use crate::{
    requirement::types::{DatabaseRequirement, UnitRequirement},
    service::file::import,
};
use std::path::Path;
use std::rc::Rc;
use std::sync::{Arc, Mutex};
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

impl InvTable {
    /// Get the inventory table with an ArcMutex lock
    pub fn get_current() -> Arc<Self> {
        CURRENT_INV_TABLE.with(|c| c.lock().unwrap().clone())
    }
    pub fn set_current(self) {
        CURRENT_INV_TABLE.with(|c| *c.lock().unwrap() = Arc::new(self))
    }

    pub fn append(&mut self, unit: &Arc<Unit>, locker: &Arc<Locker>) {
        self.lockers.push(LockerKeychain {
            unit: Arc::clone(unit),
            locker: Arc::clone(locker)
        })
    }

    pub fn remove() { // TODO:
    }
}
