use std::sync::MutexGuard;

use self::types::{Class, Unit};
use crate::{
    compute::update_reqs,
    model::error::TauriError,
    service::file::localsave,
    state::types::{Computed, KeychainTable, Locker, Storage},
};
use tauri::State;

#[cfg(test)]
mod bacon;
mod impls;
pub mod types;
#[tauri::command]
pub fn view_store_units(store: State<Storage>) -> Vec<Unit> {
    let guard = store.store.lock().unwrap();
    // debugging
    let _list: Vec<String> = guard.units.iter().map(|e| e.name.clone()).collect();
    guard.units.clone()
}
#[tauri::command]
pub fn new_unit(name: String, class: Class, store: State<Storage>) -> Unit {
    let n_unit = Unit::new(name, class);
    let mut g_store = store.store.lock().unwrap();
    g_store.units.push(n_unit.clone());

    let binding = KeychainTable::get_current();
    let mut g_keychains: MutexGuard<KeychainTable> = binding.lock().unwrap();
    let locker: Locker = Locker(n_unit.clone().current.get_algos());
    // new keychain to table
    g_keychains.append(
        &n_unit.clone(),
        &locker,
    );
    // add content to locker
    let mut g_lockers = store.lockers.lock().unwrap();
    g_lockers.push(locker);

    n_unit
}
#[tauri::command]
pub fn delete_unit(index: usize, store: State<Storage>) -> Result<(), TauriError> {
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
    store: State<'_, Storage>,
    computed: State<'_, Computed>,
) -> Result<Vec<usize>, &'static str> {
    println!("[invoke] save_units");
    let mut guard = store.store.lock().unwrap();
    for (unit, index) in units.iter() {
        guard.units[*index] = unit.clone();
    }
    update_reqs(&guard, computed).unwrap();
    localsave(&guard).unwrap();

    let edited: Vec<usize> = units.iter().map(|e| e.1).collect();
    Ok(edited)
}
