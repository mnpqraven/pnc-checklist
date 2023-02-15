use super::types::UserJSON;
use crate::consts::{ENDPOINT_PATH, INVOKE_KEY_PATH, SCHEMA_PATH};
use crate::service::databinding::*;
use crate::state::build_inject::*;
use schemars::schema_for;
use std::error::Error;
use std::fs;

#[test]
fn generate_type_indexes() -> Result<(), Box<dyn Error>> {
    println!("[RUNNABLE] generate_type_indexes");
    write_index_binding::<AllEnums>(Folder::Enums)?;
    write_index_binding::<AllStructs>(Folder::Structs)?;
    write_index_keys("Ivk", INVOKE_KEY_PATH)?;
    write_enum_table::<AllEnums>("Enum_Table")?;
    Ok(())
}

/// Update steps:
/// - Update version in `Cargo.toml`
/// - Run this runnable > build, this will automatically update the version
/// number in other places across the app
/// - Commit + push
#[test]
fn update_version() -> Result<(), Box<dyn Error>> {
    println!("[RUNNABLE] update_version");
    _update_tauri_conf()?;
    let built = _build_payload(_get_payload()?)?;
    _write_endpoint(ENDPOINT_PATH, &built)?;
    Ok(())
}

#[test]
fn generate_schema() -> Result<(), Box<dyn Error>> {
    println!("[RUNNABLE] generate_schema");
    let schema = schema_for!(UserJSON);
    fs::write(SCHEMA_PATH, serde_json::to_string_pretty(&schema).unwrap())?;
    Ok(())
}
