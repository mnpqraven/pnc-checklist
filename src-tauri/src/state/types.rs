use std::sync::{Arc, Mutex, RwLock};

use crate::{
    algorithm::types::AlgoPiece, requirement::types::DatabaseRequirement, stats::types::*,
    unit::types::*,
};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

/// Main storage, state managed by tauri
pub struct Storage {
    pub store: Mutex<UserStore>, // User's JSON
    pub db: Mutex<GrandResource>, // User's JSON
                                 // pub locker: PtrTable
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

#[derive(Default)]
// pub struct PtrTable(pub Vec<InvLocker>);
pub struct PtrTable(pub Vec<i32>);

pub struct InvLocker {
    _unit: Unit,
    _locker: Vec<AlgoPiece>,
}
// impl PtrTable {
//     fn current() -> Arc<PtrTable> {
//         CURRENT_PTR_TABLE.with(|c| c.read().unwrap().clone())
//     }
//     fn make_current(self) {
//         CURRENT_PTR_TABLE.with(|c| *c.write().unwrap() = Arc::new(self))
//     }

//     fn info(&self) {
//         println!("{:?}", &self.0);
//     }
// }
// thread_local! {
//     // static CURRENT_PTR_TABLE: RwLock<Arc<PtrTable>> = RwLock::new(Default::default());
//     static CURRENT_PTR_TABLE: Arc<Mutex<PtrTable>> =
//     Arc::new(Mutex::new(Default::default()))
// }

#[cfg(test)]
mod playground {
    use std::sync::{Arc, Mutex};
    #[derive(Default)]
    pub struct PlaygroundTable(pub Vec<i32>);
    impl PlaygroundTable {
        // TODO: documentation
        // fn lock_grd() -> Arc<Mutex<PlaygroundTable>> {
        fn current() -> Arc<Mutex<PlaygroundTable>> {
            CURRENT_PTR_TABLE.with(|c| c.clone())
        }

        fn debug(&self) {
            println!("{:?}", &self.0);
        }
    }
    // TODO: documentation
    thread_local! {
        static CURRENT_PTR_TABLE: Arc<Mutex<PlaygroundTable>> = Arc::new(Mutex::new(Default::default()));
    }
    #[test]
    fn t_main() {
        // PlaygroundTable(vec![12, 3, 2]).make_current();
        let current = PlaygroundTable::current();
        let mut guard = current.lock().unwrap();
        guard.0 = vec![1, 2, 3, 4, 0];
        guard.debug();
        drop(guard);
    }
}
