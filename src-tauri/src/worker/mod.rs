use crate::model::error::TauriError;

pub mod build_inject;

const ENDPOINT: &str = "endpoint.json";
const TAURI_CONF: &str = "tauri.conf.json";
const PUB_SIGNATURE: &str = "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRcFpkOUVxRTVxQklWb1NiMTNvcG9NVU9nVnhHajA0STl4UW1Oekp1cGkyWnJlejMyMTh0Vk42Skc3YzB1UVZjcHJrbUhSMzhNZWhZZjZ5YXBZN0pQNmlvSkUwdm1UY2dvPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNjcyNjQ5OTE4CWZpbGU6cG5jLWNoZWNrbGlzdF8wLjEuMV94NjRfZW4tVVMubXNpLnppcApjMUoyUDZzVlpUZ29iNmxBUGF2MVZjNENjQksxTkFvTlBBYWJLOWxMcWlLUUdGNXYxcXlPellJTU83K0Y3Uytwak1HMThQRVQrUjZ1cWd5M3ZpNWJBZz09Cg==";

/// Worker during application build, this should not be evaluated inside release build
#[cfg(test)]
mod runnables {
    use super::{
        build_inject::{build_payload, get_payload, write_endpoint},
        ENDPOINT,
    };
    use crate::model::cmdbindings::*;

    #[test]
    fn generate_type_indexes() {
        write_index_binding::<AllEnums>(Folder::Enums).unwrap();
        write_index_binding::<AllStructs>(Folder::Structs).unwrap();
        write_index_keys("Invoke_Keys", "bindings/invoke_keys.ts").unwrap();
    }

    #[test]
    // TODO: test, what about signatures
    /// update steps:
    /// update version in `Cargo.toml`
    /// run this runnable > build > (built sig ??) > commit + push
    fn update_endpoint_json() -> Result<(), &'static str> {
        let built = build_payload(get_payload(ENDPOINT.to_string()).unwrap()).unwrap();
        write_endpoint(ENDPOINT.to_string(), &built).unwrap();
        Ok(())
    }
}
