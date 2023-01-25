use super::types::{Computed, GrandResource, JSONStorage, KeychainTable, Locker, UserJSON};
use crate::algorithm::types::AlgoPiece;
use crate::stats::types::*;
use crate::unit::types::{Class, Unit};
use crate::{
    requirement::types::{DatabaseRequirement, UnitRequirement},
    service::file::import,
};
use std::path::Path;
use std::sync::{Arc, Mutex};
use strum::IntoEnumIterator;
use tauri::api::path::data_dir;

impl Default for UserJSON {
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
impl UserJSON {
    pub fn compute_default() -> Vec<Arc<Mutex<Unit>>> {
        let mut v = Vec::new();
        let units = UserJSON::default().units;
        for unit in units.into_iter() {
            v.push(Arc::new(Mutex::new(unit)));
        }
        v
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
    // NOTE: important: using initialized store to produce `Arc`s
    pub fn inject(store: &Vec<Arc<Mutex<Unit>>>) -> Self {
        let mut keychains = Vec::new();
        for unit in store.iter() {
            let t = unit.lock().unwrap().get_current_algos();
            // NOTE: AlgoPiece inside AlgoSet likely needs ArcMutexes
            // ALgoSet > AlgoPiece { offense: Vec<Arc<Mutex<AlgoPiece>>>, .. }
            keychains.push((Arc::clone(unit), Arc::new(Mutex::new(Locker::new(t)))));
        }
        let keychains = Mutex::new(keychains);
        Self { keychains }
    }
}

impl Default for DatabaseRequirement {
    // TODO: use new store and injection
    fn default() -> Self {
        let store: UserJSON = UserJSON::default();
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

impl Locker {
    pub fn new(value: Vec<AlgoPiece>) -> Self {
        Self(value)
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
            units: lock
                .iter()
                .map(|c| c.lock().unwrap().clone())
                .collect(),
        }
    }
}

impl KeychainTable {
    pub fn append_unit(&self, unit: Unit, algos: Vec<AlgoPiece>) {
        let arc_unit = Arc::new(Mutex::new(unit));
        let arc_algos = Arc::new(Mutex::new(Locker::new(algos)));
        self.keychains.lock().unwrap().push((arc_unit, arc_algos));
    }
}
