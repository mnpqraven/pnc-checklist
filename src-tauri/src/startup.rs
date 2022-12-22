use crate::model::infomodel::{ImportChunk, SchemalessImportChunk};
use std::fs;

#[tauri::command]
pub fn import_userdata() -> ImportChunk {
    // TODO: dynamic path
    let file = fs::read_to_string("./data/user/schemadata.json")
        .expect("can't open file, check perm or path");
    let res: ImportChunk = serde_json::from_str(&file).expect("unable to parse");
    println!("{:?}", res);
    res
}

#[tauri::command]
pub fn import_userdata_schemaless() -> SchemalessImportChunk {
    let file = fs::read_to_string("./data/user/schemalessdata.json")
        .expect("can't open file, check perm or path");
    let res: SchemalessImportChunk = serde_json::from_str(&file).expect("unable to parse");
    println!("{:?}", res);
    res
}
