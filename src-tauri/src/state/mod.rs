use self::types::{Keychain, KeychainTable};
use crate::{algorithm::types::AlgoPiece, service::errors::TauriError, unit::types::Unit};
use semver::Version;
use std::sync::Weak;
use tauri::State;

pub mod build_inject;
mod impls;
mod runnables;
pub mod types;

#[allow(dead_code)]
const TAURI_CONF_PATH: &str = "tauri.conf.json";
#[allow(dead_code)]
const ENDPOINT_PATH: &str = "endpoint.json";
#[allow(dead_code)]
const INVOKE_KEY_PATH: &str = "bindings/invoke_keys.ts";
#[allow(dead_code)]
const PUB_SIGNATURE: &str = "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRcFpkOUVxRTVxQklWb1NiMTNvcG9NVU9nVnhHajA0STl4UW1Oekp1cGkyWnJlejMyMTh0Vk42Skc3YzB1UVZjcHJrbUhSMzhNZWhZZjZ5YXBZN0pQNmlvSkUwdm1UY2dvPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNjcyNjQ5OTE4CWZpbGU6cG5jLWNoZWNrbGlzdF8wLjEuMV94NjRfZW4tVVMubXNpLnppcApjMUoyUDZzVlpUZ29iNmxBUGF2MVZjNENjQksxTkFvTlBBYWJLOWxMcWlLUUdGNXYxcXlPellJTU83K0Y3Uytwak1HMThQRVQrUjZ1cWd5M3ZpNWJBZz09Cg==";

#[tauri::command]
pub fn get_tauri_version() -> Result<Version, TauriError> {
    let ver = env!("CARGO_PKG_VERSION");

    match Version::parse(ver.trim_matches('\"')) {
        Ok(version) => Ok(version),
        Err(_) => Err(TauriError::ResourceRequestFailed("version".to_string())),
    }
}

#[tauri::command]
/// dev: traverse locker tree and return content with respective owner
pub fn view_locker(keychain: State<KeychainTable>) -> Vec<(AlgoPiece, Option<Unit>)> {
    println!("[invoke] view_locker");
    let mut v: Vec<(AlgoPiece, Option<Unit>)> = Vec::new();

    let g_kc = keychain.keychains.lock().unwrap();
    for chain in g_kc.iter() {
        // dbg!(&Arc::strong_count(&chain.locker));
        // dbg!(&Weak::strong_count(&chain.unit));
        // let attempt_algo = Arc::upgrade(&chain.locker);
        let algo = chain.locker.lock().unwrap();
        let attempt_unit = Weak::upgrade(&chain.unit);
        match attempt_unit {
            Some(val) => v.push((algo.clone(), Some(val.lock().unwrap().clone()))),
            None => v.push((algo.clone(), None)),
        }
    }
    v
}

#[tauri::command]
pub fn remove_kc(index: usize, keychain: State<KeychainTable>) -> Result<Keychain, TauriError> {
    println!("[invoke] remove_kc");
    if let Ok(mut g_kc) = keychain.keychains.lock() {
        if index < g_kc.len() {
            Ok(g_kc.remove(index))
        } else {
            Err(TauriError::UnitModification)
        }
    } else {
        Err(TauriError::RequestLockFailed)
    }
}

#[tauri::command]
/// deletes all `Keychain` without a dedicated owner (`Unit`)
pub fn clear_ownerless(keychain: State<KeychainTable>) -> Result<(), TauriError> {
    match keychain.keychains.lock() {
        Ok(mut g_kc) => {
            g_kc.retain(|kc| Weak::upgrade(&kc.unit).is_some());
            Ok(())
        }
        _ => Err(TauriError::RequestLockFailed),
    }
}

#[tauri::command]
pub fn dev(keychain: State<KeychainTable>) -> Result<(), TauriError> {
    // let g_kcs = keychain.keychains_group_piece();
    Ok(())
}
