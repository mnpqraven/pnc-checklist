use self::types::{Class, Unit};
use crate::{
    algorithm::types::AlgoPiece,
    compute::update_reqs,
    model::error::TauriError,
    service::file::localsave,
    state::types::{Computed, JSONStorage, KeychainTable},
};
use std::sync::{Arc, Mutex};
use tauri::State;

#[cfg(test)]
mod bacon;
mod impls;
pub mod types;

#[tauri::command]
pub fn view_store_units(computed: State<Computed>) -> Result<Vec<Unit>, TauriError> {
    match computed.units.lock() {
        Ok(units) => Ok(units.iter().map(|c| c.lock().unwrap().clone()).collect()),
        _ => Err(TauriError::RequestLockFailed),
    }
}

#[tauri::command]
/// Adds a new `Unit` into the database
/// NOTE: origin data needs an `Arc::new()` &&
/// `KeychainTable` + `Computed` needs to point to the same `Unit`
pub fn new_unit(
    name: String,
    class: Class,
    computed: State<Computed>,
    keyc: State<KeychainTable>,
) -> Result<Unit, TauriError> {
    let n_unit = Unit::new(name, class);
    let res = if let Ok(mut g_computed) = computed.units.lock() {
        let arc_unit = Arc::new(Mutex::new(n_unit.clone()));
        g_computed.push(Arc::clone(&arc_unit));

        let lockers: Vec<Arc<Mutex<AlgoPiece>>> = arc_unit
            .lock()
            .unwrap()
            .get_current_algos()
            .into_iter()
            .cloned()
            .map(|e| Arc::new(Mutex::new(e)))
            .collect();
        keyc.assign(&arc_unit, &lockers);
        Ok(n_unit)
    } else {
        Err(TauriError::UnitModification)
    };
    update_reqs(computed)?;
    res
}

#[tauri::command]
pub fn delete_unit(index: usize, computed: State<Computed>) -> Result<(), TauriError> {
    println!("[invoke] delete_units");
    let res = match computed.units.lock() {
        Ok(mut g_units) if index < g_units.len() => {
            g_units.remove(index);
            Ok(())
        }
        Ok(_) => Err(TauriError::UnitModification),
        _ => Err(TauriError::RequestLockFailed),
    };
    update_reqs(computed)?;
    res
}

#[tauri::command]
pub fn save_units(
    units: Vec<(Unit, usize)>,
    computed: State<Computed>,
    storage: State<JSONStorage>,
    kc: State<KeychainTable>,
) -> Result<Vec<usize>, TauriError> {
    println!("[invoke] save_units");
    {
        if let Ok(g_computed_units) = computed.units.lock() {
            for (unit, index) in units.iter() {
                let am_unit = g_computed_units.get(*index).unwrap();

                let g_kc = kc.keychains.lock().unwrap();

                if let Ok(mut g_unit) = am_unit.lock() {
                    *g_unit = unit.clone();
                } else {
                    return Err(TauriError::RequestLockFailed);
                }
                KeychainTable::update_keychain(g_kc, &Arc::downgrade(am_unit));
            }
        } else {
            return Err(TauriError::RequestLockFailed); // early return
        }
    }

    // TODO:
    if let Ok(g_store) = storage.store.lock() {
        let json = computed.to_user_json(&g_store);
        localsave(&json).unwrap();
    } else {
        return Err(TauriError::RequestLockFailed);
    }
    update_reqs(computed).unwrap();

    let edited: Vec<usize> = units.iter().map(|e| e.1).collect();
    Ok(edited)
}
