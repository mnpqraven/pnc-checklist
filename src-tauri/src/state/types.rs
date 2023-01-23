use crate::{
    algorithm::types::AlgoPiece, requirement::types::DatabaseRequirement, stats::types::*,
    unit::types::*,
};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use ts_rs::TS;

/// Main storage, state managed by tauri
pub struct Storage {
    pub store: Mutex<UserStore>,  // User's JSON
    pub db: Mutex<GrandResource>, // User's JSON
    pub inv_table: Mutex<Arc<InvTable>>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct UserStore {
    #[serde(rename = "$schema")]
    pub schema: String,
    pub database: Database,
    pub units: Vec<Unit>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct Database {
    pub skill: SkillCurrency,
    pub coin: Coin,
}

#[derive(Debug, Serialize, Deserialize, Default, TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct GrandResource {
    pub skill: SkillCurrency,
    pub coin: Coin,
    pub widgets: Vec<WidgetResource>,
    pub exp: Exp,
    pub neural_kits: u32,
    // rolls ?
}

/// data computed from the backend, state managed by tauri
pub struct Computed {
    pub database_req: Mutex<DatabaseRequirement>,
}

// -- structs for the InvTable and hookup management between user units and db
#[derive(Debug, Default)]
pub struct InvTable {
    pub lockers: Vec<LockerKeychain>,
}

#[derive(Debug, Default)]
pub struct LockerKeychain {
    pub unit: Arc<Unit>,     // points to user's Unit vec
    pub locker: Arc<Locker>, // points to Computed's Inv Vec
}

#[derive(Debug, Default)]
pub struct Locker(pub Vec<AlgoPiece>); // expand point here for future fields

thread_local! {
    pub static CURRENT_INV_TABLE: Mutex<Arc<InvTable>> = Mutex::new(Arc::new(Default::default()));
}

#[cfg(test)]
mod playground {
    use std::{
        rc::Rc,
        sync::{Arc, Mutex},
    };
    #[derive(Default, Debug)]
    pub struct TLocker {
        // pub list: Vec<i32>,
        // pub owner: Rc<Unit>,
        pub keychains: Vec<(Arc<Unit>, Arc<InvLocker>)>, // owner + locker tuple
    }

    #[derive(Default, Debug)]
    pub struct Unit {
        _name: String,
    }
    #[derive(Default, Debug)]
    pub struct InvLocker {
        _algos: Vec<i32>,
    }
    impl TLocker {
        // TODO: documentation
        // fn lock_grd() -> Arc<Mutex<PlaygroundTable>> {
        fn current() -> Arc<Mutex<TLocker>> {
            CURRENT_PTR_TABLE.with(|c| c.clone())
        }

        fn new_item(&mut self, keychain: (Arc<Unit>, Arc<InvLocker>)) {
            self.keychains
                .push((Arc::clone(&keychain.0), Arc::clone(&keychain.1)))
        }
    }
    // TODO: documentation
    thread_local! {
        static CURRENT_PTR_TABLE: Arc<Mutex<TLocker>> = Arc::new(Mutex::new(Default::default()));
    }
    #[test]
    #[ignore = "playground debug"]
    fn t_main() {
        let current = TLocker::current();
        let mut guard = current.lock().unwrap();
        let unit1 = Arc::new(Unit {
            _name: "Croque".to_string(),
        });
        let unit2 = Arc::new(Unit {
            _name: "Hubble".to_string(),
        });
        let algo1 = Arc::new(InvLocker {
            _algos: vec![1, 2, 3, 4],
        });
        let algo2 = Arc::new(InvLocker {
            _algos: vec![10, 9, 8, 7],
        });

        let keychain1 = (Arc::clone(&unit1), Arc::clone(&algo1));
        let keychain2 = (Arc::clone(&unit2), Arc::clone(&algo2));
        guard.keychains = vec![keychain1, keychain2];
        println!("{:?}", guard);
        drop(guard);
        another();
    }
    fn another() {
        let current = TLocker::current();
        let mut guard = current.lock().unwrap();
        guard.new_item((
            Arc::new(Unit {
                _name: "Clukay".to_string(),
            }),
            Arc::new(InvLocker {
                _algos: vec![11, 12],
            }),
        ));
        println!("{:?}", guard);
    }
}
