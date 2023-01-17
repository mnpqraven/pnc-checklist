mod impls;
use tauri::State;
use crate::{model::structs::{UserStore, UnitRequirement, GrandResource}, state::{Computed, Storage}, requirement::{requirement_slv, requirement_neural, requirement_level, requirement_widget}};

/// updates the requirement field in the store by reading the store field
pub fn update_reqs(store: &UserStore, computed: State<Computed>) -> Result<(), &'static str> {
    // let store_guard = store.store.lock().expect("requesting mutex failed");
    let mut req_guard = computed.database_req.lock().unwrap();
    let mut reqs: Vec<UnitRequirement> = Vec::new();
    for unit in store.units.iter() {
        // TODO: landmine or Err unwraps
        reqs.push(UnitRequirement {
            skill: requirement_slv(unit.current.skill_level, unit.goal.skill_level),
            neural: requirement_neural(unit.current.frags, unit.current.neural, unit.goal.neural)
                .unwrap(),
            level: requirement_level(unit.current.level.0, unit.goal.level.0).unwrap(),
            breakthrough: requirement_widget(unit.class, unit.current.level.0, unit.goal.level.0)
                .unwrap(),
        })
    }
    req_guard.unit_req = reqs;
    Ok(())
}

#[tauri::command]
pub fn get_needed_rsc(computed: State<'_, Computed>) -> GrandResource {
    let guard_req = computed.database_req.lock().unwrap();
    let t = guard_req.generate_resource();
    println!("{:?}", t);
    t
}

#[tauri::command]
pub fn update_chunk(chunk: UserStore, store: State<Storage>) -> Result<(), &'static str> {
    let mut store = store.store.lock().unwrap();
    *store = chunk;
    Ok(())
}