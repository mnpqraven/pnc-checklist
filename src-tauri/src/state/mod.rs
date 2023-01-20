// TODO: test tauri Mutex
use std::sync::Mutex;

use crate::model::structs::{GrandResource, UserStore};
use crate::requirement::types::DatabaseRequirement;

mod impls;

/// Main storage, state managed by tauri
pub struct Storage {
    pub store: Mutex<UserStore>,  // User's JSON
    pub db: Mutex<GrandResource>, // User's JSON
}
/// data computed from the backend, state managed by tauri
pub struct Computed {
    pub database_req: Mutex<DatabaseRequirement>,
}
