use std::sync::{Arc, Mutex, MutexGuard};

use self::types::{Class, Unit};
use crate::{
    compute::update_reqs,
    model::error::TauriError,
    service::file::localsave,
    state::types::{Computed, KeychainTable, Locker, JSONStorage, UserJSON},
};
use tauri::State;

#[cfg(test)]
mod bacon;
mod impls;
pub mod types;

#[tauri::command]
pub fn view_store_units(store: State<Computed>) -> Vec<Unit> {
    let guard = store.units.lock().unwrap();

    guard.iter().map(|c| c.lock().unwrap().clone()).collect()
}
#[tauri::command]
pub fn new_unit(name: String, class: Class, computed: State<Computed>, keyc: State<KeychainTable>) -> Unit {
    let n_unit = Unit::new(name, class);
    let mut g_computed = computed.units.lock().unwrap();

    // NOTE: origin data needs a new()
    g_computed.push(Arc::new(Mutex::new(n_unit.clone())));

    // TODO: algo using arc clone
    keyc.append_unit(n_unit.clone(), n_unit.get_current_algos());

    n_unit
}
#[tauri::command]
pub fn delete_unit(index: usize, store: State<JSONStorage>) -> Result<(), TauriError> {
    let mut guard = store.store.lock().unwrap();
    if index < guard.units.len() {
        guard.units.remove(index);
        Ok(())
    } else {
        Err(TauriError::UnitModification)
    }
}
#[tauri::command]
pub fn save_units(
    units: Vec<(Unit, usize)>,
    computed: State<'_, Computed>,
    storage: State<'_, JSONStorage>
) -> Result<Vec<usize>, &'static str> {
    println!("[invoke] save_units");
    { // INFO: lock
        let g_computed = computed.units.lock().unwrap();
        for (unit, index) in units.iter() {
            let m_unit = g_computed.get(*index).unwrap();
            let mut g_unit = m_unit.lock().unwrap();
            *g_unit = unit.clone();
        }
    }

    // TODO:
    // update_reqs(&guard, computed).unwrap();
    let g_store = storage.store.try_lock().unwrap();
    let json = computed.to_user_json(&g_store);
    localsave(&json).unwrap();

    let edited: Vec<usize> = units.iter().map(|e| e.1).collect();
    Ok(edited)
}
