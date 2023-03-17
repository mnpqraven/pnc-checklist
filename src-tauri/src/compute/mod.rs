mod impls;
use crate::requirement::types::{DatabaseRequirement, UnitRequirement};
use crate::service::errors::TauriError;
use crate::state::types::{Computed, GrandResource, JSONStorage};
use crate::unit::get_units_iternal;
use crate::{
    requirement::{
        requirement_algo_unit, requirement_level, requirement_neural, requirement_slv,
        requirement_widget,
    },
    state::types::UserJSON,
};
use std::sync::Arc;
use tauri::State;

/// updates the requirement field in the store by reading the store field
pub fn update_reqs(computed: State<Computed>) -> Result<(), TauriError> {
    // let store_guard = store.store.lock().expect("requesting mutex failed");
    let mut req_guard = computed.database_req.lock().unwrap();
    let g_units = computed.units.lock().unwrap();
    let mut reqs: Vec<UnitRequirement> = Vec::new();
    for unit in g_units.iter() {
        let unit = unit.lock().unwrap();
        // WARN: landmine of Err unwraps
        reqs.push(UnitRequirement {
            skill: requirement_slv(unit.current.skill_level, unit.goal.skill_level),
            neural: requirement_neural(unit.current.frags, unit.current.neural, unit.goal.neural)
                .unwrap(),
            level: requirement_level(unit.current.level.0, unit.goal.level.0).unwrap(),
            breakthrough: requirement_widget(unit.class, unit.current.level.0, unit.goal.level.0)
                .unwrap(),
            algo: requirement_algo_unit(&Arc::new(unit)).unwrap(),
        })
    }
    req_guard.unit_req = reqs;
    Ok(())
}

#[tauri::command]
pub async fn get_needed_rsc() -> Result<GrandResource, TauriError> {
    println!("[invoke] get_needed_rsc");
    let units = get_units_iternal().await.unwrap();
    let db_req = DatabaseRequirement::process_list(units)?;
    let t = db_req.generate_resource();
    println!("{:?}", t);
    Ok(t)
}

#[tauri::command]
pub fn update_chunk(chunk: UserJSON, store: State<JSONStorage>) -> Result<(), &'static str> {
    let mut store = store.store.lock().unwrap();
    *store = chunk;
    Ok(())
}
