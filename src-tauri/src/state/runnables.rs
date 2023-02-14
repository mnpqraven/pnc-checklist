#[allow(unused_imports)]
use super::INVOKE_KEY_PATH;
#[allow(unused_imports)]
use crate::service::databinding::*;
#[allow(unused_imports)]
use crate::state::{build_inject::*, ENDPOINT_PATH};
#[allow(unused_imports)]
use std::error::Error;

#[test]
fn generate_type_indexes() -> Result<(), Box<dyn Error>> {
    write_index_binding::<AllEnums>(Folder::Enums)?;
    write_index_binding::<AllStructs>(Folder::Structs)?;
    write_index_keys("Ivk", INVOKE_KEY_PATH)?;
    write_enum_table::<AllEnums>("Enum_Table")?;
    Ok(())
}

/// Update steps:
/// - Update version in `Cargo.toml`
/// - Run this runnable > build, this will automatically update 
/// the version number in other places across the app
/// - Commit + push
#[test]
fn update_version() -> Result<(), Box<dyn Error>> {
    _update_tauri_conf()?;
    let built = _build_payload(_get_payload()?)?;
    _write_endpoint(ENDPOINT_PATH, &built)?;
    Ok(())
}
