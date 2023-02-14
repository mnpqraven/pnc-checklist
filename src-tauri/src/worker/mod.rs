use self::build_inject::{_build_payload, _get_payload, write_endpoint};

pub mod build_inject;

#[allow(dead_code)]
const ENDPOINT: &str = "endpoint.json";
#[allow(dead_code)]
const TAURI_CONF: &str = "tauri.conf.json";
#[allow(dead_code)]
const PUB_SIGNATURE: &str = "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRcFpkOUVxRTVxQklWb1NiMTNvcG9NVU9nVnhHajA0STl4UW1Oekp1cGkyWnJlejMyMTh0Vk42Skc3YzB1UVZjcHJrbUhSMzhNZWhZZjZ5YXBZN0pQNmlvSkUwdm1UY2dvPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNjcyNjQ5OTE4CWZpbGU6cG5jLWNoZWNrbGlzdF8wLjEuMV94NjRfZW4tVVMubXNpLnppcApjMUoyUDZzVlpUZ29iNmxBUGF2MVZjNENjQksxTkFvTlBBYWJLOWxMcWlLUUdGNXYxcXlPellJTU83K0Y3Uytwak1HMThQRVQrUjZ1cWd5M3ZpNWJBZz09Cg==";

pub fn update_endpoint_json() -> Result<(), &'static str> {
    let built = _build_payload(_get_payload(ENDPOINT.to_string()).unwrap()).unwrap();
    write_endpoint(ENDPOINT.to_string(), &built).unwrap();
    Ok(())
}

#[cfg(test)]
mod runnables {
    use super::{
        build_inject::{_build_payload, _get_payload,  _update_tauri_conf, write_endpoint},
        ENDPOINT,
    };
    use crate::model::cmdbindings::*;

    #[test]
    fn generate_type_indexes() {
        write_index_binding::<AllEnums>(Folder::Enums).unwrap();
        write_index_binding::<AllStructs>(Folder::Structs).unwrap();
        write_index_keys("Invoke_Keys", "bindings/invoke_keys.ts").unwrap();
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
