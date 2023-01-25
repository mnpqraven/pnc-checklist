use self::types::Computed;
use crate::{state::types::KeychainTable, unit::types::Unit};
use tauri::State;

mod impls;
pub mod types;

#[tauri::command]
/// dev: traverse locker tree and return content with respective owner
pub fn view_locker(computed: State<Computed>, keychain: State<KeychainTable>) -> Vec<Unit> {
    println!("VIEW LOCKER");
    let g_computed = computed.units.lock().unwrap();
    dbg!(&g_computed);

    let mut v: Vec<Unit> = Vec::new();
    for keychain in g_computed.iter() {
        let g_unit = keychain.lock().unwrap();
        println!("{:?}", g_unit.name);
        v.push(g_unit.clone());
    }

    let g_kc = keychain.keychains.lock().unwrap();
    dbg!(&g_kc);
    v
}
