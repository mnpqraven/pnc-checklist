use crate::{algorithm::types::AlgoPiece, state::types::KeychainTable, unit::types::Unit};
use std::sync::{Weak, Arc};
use tauri::State;

mod impls;
pub mod types;

#[tauri::command]
/// dev: traverse locker tree and return content with respective owner
pub fn view_locker(keychain: State<KeychainTable>) -> Vec<(AlgoPiece, Option<Unit>)> {
    println!("VIEW LOCKER");
    let mut v: Vec<(AlgoPiece, Option<Unit>)> = Vec::new();

    let g_kc = keychain.keychains.lock().unwrap();
    for chain in g_kc.iter() {
        dbg!(&Arc::strong_count(&chain.locker));
        dbg!(&Weak::strong_count(&chain.unit));
        // let attempt_algo = Arc::upgrade(&chain.locker);
        let algo = chain.locker.lock().unwrap();
        let attempt_unit = Weak::upgrade(&chain.unit);
        match attempt_unit {
            Some(val) => v.push(( algo.clone() , Some(val.lock().unwrap().clone()) )),
            None => v.push((algo.clone(), None))
        }
    }
    v
}
