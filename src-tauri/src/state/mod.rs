// TODO: test tauri Mutex
use self::types::*;
use crate::{requirement::types::DatabaseRequirement, stats::types::GrandResource};
use std::sync::Mutex;

mod impls;
pub mod types;

/// Main storage, state managed by tauri
pub struct Storage {
    pub store: Mutex<UserStore>,  // User's JSON
    pub db: Mutex<GrandResource>, // User's JSON
}
/// data computed from the backend, state managed by tauri
pub struct Computed {
    pub database_req: Mutex<DatabaseRequirement>,
}
