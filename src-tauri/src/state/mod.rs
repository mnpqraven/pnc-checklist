use crate::{
    algorithm::types::AlgoPiece, model::error::TauriError, state::types::KeychainTable,
    unit::types::Unit,
};
use std::sync::Weak;
use tauri::State;

use self::types::Keychain;

mod impls;
pub mod types;

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
