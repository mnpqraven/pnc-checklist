use self::types::{Class, Unit};
use crate::{
    compute::update_reqs,
    model::error::TauriError,
    service::file::localsave,
    state::types::{Computed, InvTable, Locker, Storage},
};
use std::sync::Arc;
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
    let new_unit = Unit::new(name, class);
    let mut guard = store.store.lock().unwrap();
    guard.units.push(new_unit.clone());

    // appending to locker
    // TODO: test
    let current = InvTable::get_current();
    // let mut table = current.lock().unwrap();
    // table.append(&Arc::new(new_unit.clone()), &Arc::new(Locker(Vec::new())));

    new_unit
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
