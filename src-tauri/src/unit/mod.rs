use self::types::{Class, Unit};
use crate::{
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
pub async fn get_units(computed: State<'_, Computed>) -> Result<Vec<Unit>, TauriError> {
    println!("[invoke] view_store_units");
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
) -> Result<(Unit, usize), TauriError> {
    println!("[invoke] new_unit");
    let n_unit = Unit::new(name, class);
    let res = if let Ok(mut g_computed) = computed.units.lock() {
        let ind = g_computed.len();
        let am_unit = Arc::new(Mutex::new(n_unit.clone()));

        g_computed.push(Arc::clone(&am_unit));

        let lockers = Unit::create_lockers(&am_unit)?;
        keyc.assign(&am_unit, &lockers);
        Ok((n_unit, ind))
    } else {
        Err(TauriError::UnitModification)
    };
    update_reqs(computed)?;
    res
}

#[tauri::command]
pub fn delete_unit(index: usize, computed: State<Computed>) -> Result<usize, TauriError> {
    println!("[invoke] delete_units");
    let res = match computed.units.lock() {
        Ok(mut g_units) if index < g_units.len() => {
            let i_to_land = match index {
                0 => 0,
                x if x == g_units.len() - 1 => index - 1,
                _ => index,
            };
            g_units.remove(index);
            Ok(i_to_land)
        }
        Ok(_) => Err(TauriError::UnitModification),
        _ => Err(TauriError::RequestLockFailed),
    };
    update_reqs(computed)?;
    res
}

#[tauri::command]
pub fn get_unit(index: usize, computed: State<Computed>) -> Result<Unit, TauriError> {
    if let Ok(g_computed) = computed.units.lock() {
        match g_computed.get(index) {
            Some(unit) => {
                if let Ok(g_unit) = unit.lock() {
                    Ok(g_unit.clone())
                } else {
                    Err(TauriError::RequestLockFailed)
                }
            }
            None => Err(TauriError::UnitNotFound),
        }
    } else {
        Err(TauriError::RequestLockFailed)
    }
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
                dbg!(&unit.class);
                let am_unit = g_computed_units.get(*index).unwrap();

                let g_kc = kc.keychains.lock().unwrap();

                if let Ok(mut g_unit) = am_unit.lock() {
                    *g_unit = unit.clone();
                } else {
                    return Err(TauriError::RequestLockFailed);
                }
                KeychainTable::update_keychain(g_kc, am_unit);
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
