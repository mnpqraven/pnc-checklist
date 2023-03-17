use self::types::{Class, Unit};
use crate::{
    compute::update_reqs,
    service::{db::get_db, errors::TauriError, file::localsave},
    state::types::{Computed, JSONStorage, KeychainTable},
    traits::FromAsync,
};
use prisma_client_rust::QueryError;
use tauri::State;

// #[cfg(test)]
// mod bacon;
mod impls;
pub mod types;

pub async fn get_units_iternal() -> Result<Vec<Unit>, QueryError> {
    println!("[invoke] get_units");
    let client = get_db().await;
    let db_units = client.unit().find_many(vec![]).exec().await?;

    let units = futures::future::join_all(
        db_units
            .into_iter()
            .map(|db_unit| async { Unit::from_async(db_unit).await }),
    )
    .await;
    Ok(units)
}

// TODO: to refactor
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

// TODO: to refactor
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

// TODO: to refactor
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
