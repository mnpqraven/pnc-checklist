use crate::{
    model::{error::TauriError, structs::AlgoPiece},
    state::Storage,
};
use tauri::State;

// WARN: potential zombie code
pub fn _get_needed_algos(computed: State<Storage>) -> Result<(), TauriError> {
    let guard = computed.store.lock().unwrap();
    let mut needed_algo: Vec<AlgoPiece> = Vec::new();
    for unit in guard.units.iter() {
        // TODO: helper function in Unit
        // returns needed algo list with criteria:
        // piece from current and algo is exact match then doesn't return
        // otherwise return
        needed_algo.append(&mut unit.get_missing_algos())
    }
    Ok(())
}
