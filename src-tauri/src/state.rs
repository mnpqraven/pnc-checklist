use crate::{model::structs::{UserStore, GrandResource, DatabaseRequirement, UnitRequirement}, parser::file::import};
use std::{path::Path, sync::Mutex};
use tauri::api::path::data_dir;

/// Main storage, state managed by tauri
pub struct Storage {
    pub store: Mutex<UserStore>,  // User's JSON
    pub db: Mutex<GrandResource>, // User's JSON
}
/// data computed from the backend, state managed by tauri
pub struct Computed {
    pub database_req: Mutex<DatabaseRequirement>,
}
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
        dbg!(&store.units);
        for unit in store.units.iter() {
            // TODO: test
            reqs.push(UnitRequirement::update_unit_req(unit))
        }
        Self { unit_req: reqs }
    }
}
