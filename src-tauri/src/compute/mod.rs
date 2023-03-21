mod impls;
use crate::requirement::types::DatabaseRequirement;
use crate::service::db::get_db;
use crate::service::errors::TauriError;
use crate::state::types::UserJSON;
use crate::state::types::{GrandResource, JSONStorage};
use tauri::State;

// /// updates the requirement field in the store by reading the store field
// pub async fn update_reqs(computed: State<Computed>) -> Result<(), TauriError> {
//     // let store_guard = store.store.lock().expect("requesting mutex failed");
//     let mut req_guard = computed.database_req.lock().unwrap();
//     let g_units = computed.units.lock().unwrap();
//     let mut reqs: Vec<UnitRequirement> = Vec::new();
//     for unit in g_units.iter() {
//         let unit = unit.lock().unwrap();
//         // WARN: landmine of Err unwraps
//         reqs.push(UnitRequirement {
//             skill: requirement_slv(unit.current.skill_level, unit.goal.skill_level),
//             neural: requirement_neural(unit.current.frags, unit.current.neural, unit.goal.neural)
//                 .unwrap(),
//             level: requirement_level(unit.current.level.0, unit.goal.level.0).unwrap(),
//             breakthrough: requirement_widget(unit.class, unit.current.level.0, unit.goal.level.0)
//                 .unwrap(),
//             algo: requirement_algo_unit(&Arc::new(unit)).await.unwrap(),
//         })
//     }
//     req_guard.unit_req = reqs;
//     Ok(())
// }

#[tauri::command]
pub async fn get_needed_rsc() -> Result<GrandResource, TauriError> {
    println!("[invoke] get_needed_rsc");
    let client = get_db().await;
    // TODO: refactor
    let unit_ids = client
        .unit()
        .find_many(vec![])
        .exec()
        .await
        .unwrap()
        .iter()
        .cloned()
        .map(|e| e.id)
        .collect();
    let db_req = DatabaseRequirement::process_list(unit_ids).await?;
    Ok(db_req.generate_resource())
}

#[tauri::command]
pub fn update_chunk(chunk: UserJSON, store: State<JSONStorage>) -> Result<(), &'static str> {
    let mut store = store.store.lock().unwrap();
    *store = chunk;
    Ok(())
}
