#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#![feature(arc_unwrap_or_clone)]

mod algorithm;
mod compute;
mod loadout;
mod macros;
mod model;
mod requirement;
mod service;
mod state;
mod stats;
mod table;
mod unit;
mod validator;
use std::sync::{Mutex, Arc};

use requirement::types::DatabaseRequirement;
use state::types::{Computed, KeychainTable, JSONStorage, UserJSON};
use tauri::Manager;
use unit::types::Unit;

// will be invoked during startup
use crate::{
    algorithm::{
        algo_piece_new, algo_set_new, algo_slots_compute, algorithm_all, default_slot_size,
        get_algo_by_days, main_stat_all, print_algo, print_main_stat,
    },
    compute::{get_needed_rsc, update_chunk},
    model::enum_ls,
    requirement::{
        requirement_level, requirement_neural, requirement_slv, requirement_widget,
        requirment_neural_kits,
    },
    service::file::{export, import, set_default_file},
    state::view_locker,
    table::{generate_algo_db, get_bonuses},
    unit::{delete_unit, new_unit, save_units, view_store_units},
    validator::{validate, validate_slots},
};

fn main() {
    // INFO: initial values
    let userstore: Vec<Arc<Mutex<Unit>>> = UserJSON::compute_default();
    let keychain_table: KeychainTable = KeychainTable::inject(&userstore);

    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        // JSON data
        .manage(JSONStorage::default())
        // .manage(Storage {
        //     store: Mutex::new(UserStore::default()),
        //     db: Mutex::new(GrandResource::default()),
        //     lockers: Mutex::new(Default::default()),
        // })
        // updated post launch
        .manage(Computed {
            database_req: Mutex::new(DatabaseRequirement::default()),
            // keychain_table: Mutex::new(KeychainTable::default()),
            units: Mutex::new(userstore),
        })
        .manage(keychain_table)
        .invoke_handler(tauri::generate_handler![
            // INFO:
            // ref http://wiki.42lab.cloud/w/%E9%A6%96%E9%A1%B5
            // assets for items http://wiki.42lab.cloud/w/%E9%81%93%E5%85%B7

            // algorithm
            algorithm_all,
            algo_set_new,
            algo_piece_new,
            algo_slots_compute,
            default_slot_size,
            get_algo_by_days, // probably move to table mod
            main_stat_all,
            print_algo,
            print_main_stat,
            // compute
            get_needed_rsc,
            update_chunk,
            // model
            enum_ls,
            // requirement
            requirement_slv,
            requirement_level,
            requirement_neural,
            requirment_neural_kits,
            requirement_widget,
            // state
            view_locker,
            // service
            import,
            export,
            set_default_file,
            // table
            generate_algo_db,
            get_bonuses,
            // unit
            view_store_units,
            new_unit,
            delete_unit,
            save_units,
            // validator
            validate_slots,
            validate
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
