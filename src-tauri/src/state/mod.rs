use std::sync::Arc;

use crate::{algorithm::types::AlgoPiece, unit::types::Unit};

use self::types::{Computed, Keychain, KeychainTable, Locker, Storage};
use tauri::State;

mod impls;
pub mod types;

#[tauri::command]
/// dev: traverse locker tree and return content with respective owner
pub fn view_locker(computed: State<Computed>) -> Vec<(Unit, AlgoPiece)> {
    let mut v: Vec<(Unit, AlgoPiece)>  = Vec::new();
    let g_computed = computed.keychain_table.lock().unwrap();
    for keychain in &g_computed.keychains {
        let owner: Unit = Arc::unwrap_or_clone(keychain.owner.clone());
        // content
        for piece in &keychain.locker.0 {
            v.push((owner.clone(), piece.clone()));
        }
    }
    v
}
