use crate::{
    model::infomodel::UserStore,
    parser::{
        file::import,
        requirement::{DatabaseRequirement, GrandResource, UnitRequirement},
    },
};
use std::{fs, path::Path, sync::Mutex};
use tauri::{api::path::data_dir};

pub struct Storage {
    pub store: Mutex<UserStore>, // User's JSON
    pub db: Mutex<GrandResource>, // User's JSON
                                 // pub database_req: Mutex<DatabaseRequirement>, // NOT in JSON
}
// data computed from the backend
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
        for unit in store.units.iter() {
            // TODO: test
            reqs.push(UnitRequirement::update_unit_req(unit))
        }
        Self { unit_req: reqs }
    }
}

#[tauri::command]
pub fn import_userdata(path: String) -> Result<UserStore, &'static str> {
    match fs::read_to_string(path) {
        Ok(content) => {
            let data: UserStore = serde_json::from_str(&content).expect("unable to parse");
            Ok(data)
        }
        // TODO: error handle. This will 100% eventually happen
        Err(_) => panic!("panic during import, also TODO this"),
    }
}
