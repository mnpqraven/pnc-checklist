use tauri::State;

use crate::model::infomodel::{ImportChunk, SchemalessImportChunk, Unit, Database};
use std::{fs, sync::Mutex};

pub struct Storage {
    pub store: Mutex<ImportChunk>
}
impl Default for ImportChunk {
    fn default() -> Self {
        import_userdata("./data/user/schemadata.json".to_string()).unwrap()
    }
}
#[tauri::command]
pub fn import_userdata(path: String) -> Result<ImportChunk, &'static str> {
    match fs::read_to_string(path) {
        Ok(content) => {
            let data: ImportChunk = serde_json::from_str(&content).expect("unable to parse");
            Ok(data)
        },
        // TODO: error handle. This will 100% eventually happen
        Err(..) => panic!("panic during import, also TODO this")
    }
}

// NOTE: not using
#[tauri::command]
pub fn import_userdata_schemaless() -> SchemalessImportChunk {
    let file = fs::read_to_string("./data/user/schemalessdata.json")
        .expect("can't open file, check perm or path");
    let res: SchemalessImportChunk = serde_json::from_str(&file).expect("unable to parse");
    println!("{:?}", res);
    res
}
