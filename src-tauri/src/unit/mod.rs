use std::sync::{Arc, Mutex};

use self::types::{Class, Unit};
use crate::{
    compute::update_reqs,
    model::error::TauriError,
    service::file::localsave,
    state::types::{Computed, JSONStorage, KeychainTable},
};
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
pub fn new_unit(
    name: String,
    class: Class,
    computed: State<Computed>,
    keyc: State<KeychainTable>,
) -> Result<Unit, TauriError> {
    let n_unit = Unit::new(name, class);
    let res = if let Ok(mut g_computed) = computed.units.lock() {
        // NOTE: origin data needs a new()
        g_computed.push(Arc::new(Mutex::new(n_unit.clone())));

        // TODO: correct algo using arc clone
        keyc.append_unit(n_unit.clone(), n_unit.get_current_algos());
        Ok(n_unit)
    } else {
        Err(TauriError::UnitModification)
    };
    update_reqs(computed)?;
    res
}

#[tauri::command]
pub fn delete_unit(index: usize, computed: State<Computed>) -> Result<(), TauriError> {
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
    computed: State<'_, Computed>,
    storage: State<'_, JSONStorage>,
) -> Result<Vec<usize>, TauriError> {
    println!("[invoke] save_units");
    {
        if let Ok(g_computed) = computed.units.lock() {
            for (unit, index) in units.iter() {
                let m_unit = g_computed.get(*index).unwrap();

                if let Ok(mut g_unit) = m_unit.lock() {
                    *g_unit = unit.clone();
                } else {
                    return Err(TauriError::RequestLockFailed);
                }
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
