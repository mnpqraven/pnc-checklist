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
/// update version in `Cargo.toml`
/// run this runnable > build (update version number in app)
/// update built sig to ENV
/// build again (update sig in endpoint)
/// commit + push
#[test]
fn update_version() -> Result<(), Box<dyn Error>> {
    _update_tauri_conf()?;
    let built = _build_payload(_get_payload()?)?;
    _write_endpoint(ENDPOINT_PATH, &built)?;
    Ok(())
}
