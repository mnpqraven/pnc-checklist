use tauri::api::path::data_dir;

use crate::{
    model::infomodel::ImportChunk,
    parser::{
        file::import,
        requirement::{
            requirement_slv, DatabaseRequirement, GrandResource, LevelRequirement,
            NeuralResourceRequirement, UnitRequirement, WidgetResourceRequirement,
        },
    },
};
use std::{fs, path::Path, sync::Mutex};

pub struct Storage {
    pub store: Mutex<ImportChunk>,
    pub db: Mutex<GrandResource>,
    pub database_req: Mutex<DatabaseRequirement>,
}
impl Default for ImportChunk {
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
    // TODO: this is supposed to be blank
    fn default() -> Self {
        let chunk: ImportChunk = ImportChunk::default();
        let mut reqs: Vec<UnitRequirement> = Vec::new();
        for unit in chunk.units.iter() {
            reqs.push(UnitRequirement {
                skill: requirement_slv(unit.current.skill_level, unit.goal.skill_level),
                neural: NeuralResourceRequirement::default(),
                breakthrough: WidgetResourceRequirement::default(),
                level: LevelRequirement::default(),
            })
        }
        Self { unit_req: reqs }
    }
}
// TODO: impl calculation fns

#[tauri::command]
pub fn import_userdata(path: String) -> Result<ImportChunk, &'static str> {
    match fs::read_to_string(path) {
        Ok(content) => {
            let data: ImportChunk = serde_json::from_str(&content).expect("unable to parse");
            Ok(data)
        }
        // TODO: error handle. This will 100% eventually happen
        Err(_) => panic!("panic during import, also TODO this"),
    }
}
