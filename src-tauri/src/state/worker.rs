#[cfg(test)]
mod runnables {
    use crate::service::databinding::*;
    use crate::state::{build_inject::*, ENDPOINT};

    #[test]
    fn generate_type_indexes() {
        write_index_binding::<AllEnums>(Folder::Enums).unwrap();
        write_index_binding::<AllStructs>(Folder::Structs).unwrap();
        write_index_keys("Ivk", "bindings/invoke_keys.ts").unwrap();
        write_enum_table::<AllEnums>("Enum_Table").unwrap();
    }

    /// Update steps:
    /// update version in `Cargo.toml`
    /// run this runnable > build (update version number in app)
    /// update built sig to ENV
    /// build again (update sig in endpoint)
    /// commit + push
    #[test]
    fn update_version() -> Result<(), &'static str> {
        _update_tauri_conf().unwrap();
        let built = _build_payload(_get_payload(ENDPOINT.to_string()).unwrap()).unwrap();
        write_endpoint(ENDPOINT.to_string(), &built).unwrap();
        Ok(())
    }
}
