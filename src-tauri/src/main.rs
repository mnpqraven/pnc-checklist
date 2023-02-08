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
use std::sync::Mutex;

use requirement::types::DatabaseRequirement;
use state::types::{Computed, JSONStorage, KeychainTable, UserJSON};
#[allow(unused_imports)]
use tauri::Manager;
use unit::types::Unit;

// will be invoked during startup
use crate::{
    algorithm::{
        algo_piece_new, algo_set_new, algo_slots_compute, algorithm_all, default_slot_size,
        main_stat_all, print_algo, print_main_stat, dev_print_single_main,
    },
    compute::{get_needed_rsc, update_chunk},
    model::enum_ls,
    requirement::{
        requirement_level, requirement_neural, requirement_slv, requirement_widget,
        requirment_neural_kits, dev_algo, algo_req_fulfilled,
    },
    service::file::{export, import, set_default_file},
    state::{view_locker, remove_kc, clear_ownerless},
    table::{get_algo_db, get_algo_by_days, get_bonuses},
    unit::{delete_unit, new_unit, save_units, view_store_units, get_unit},
    validator::{validate, validate_slots},
};

fn main() {
    // INFO: initial values
    // NOTE: we should handle importing in a separate fn, before default()
    let initial_units: Vec<Unit> = UserJSON::default().units;
    let (state_kc_table, initial_am_units) = KeychainTable::inject(initial_units);
    let state_computed = Computed {
        database_req: Mutex::new(
            DatabaseRequirement::process_list(&initial_am_units)
                .expect("process_list stack should not have any blocking thread"),
        ),
        units: Mutex::new(initial_am_units),
    };
    tauri::Builder::default()
        .setup(|_app| {
            #[cfg(debug_assertions)]
            {
                let window = Manager::get_window(_app, "main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        // JSON data
        .manage(JSONStorage::default())
        .manage(state_computed)
        .manage(state_kc_table)
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
            main_stat_all,
            print_algo,
            print_main_stat,
            dev_print_single_main,
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
            // requirement_algo, // TODO: conflict with Dese
            dev_algo,
            algo_req_fulfilled,
            // state
            view_locker,
            remove_kc,
            clear_ownerless,
            // service
            import,
            export,
            set_default_file,
            // table
            get_algo_db,
            get_bonuses,
            get_algo_by_days,
            // unit
            view_store_units,
            new_unit,
            delete_unit,
            save_units,
            get_unit,
            // validator
            validate_slots,
            validate
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
