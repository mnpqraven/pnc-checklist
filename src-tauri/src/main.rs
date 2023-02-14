#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#![feature(arc_unwrap_or_clone)]
#![feature(slice_partition_dedup)]

mod algorithm;
mod compute;
mod loadout;
mod macros;
mod requirement;
mod service;
mod state;
mod stats;
mod table;
mod unit;
mod validator;

use crate::{
    algorithm::{
        algo_piece_new, algo_set_fill, algo_set_new, algo_slots_compute, algorithm_all,
        default_slot_size, main_stat_all, print_algo, print_main_stat, print_main_stats,
    },
    compute::{get_needed_rsc, update_chunk},
    requirement::{
        algo_req_fulfilled, algo_req_group_piece, requirement_algo_store, requirement_level,
        requirement_neural, requirement_slv, requirement_widget, requirment_neural_kits,
    },
    service::{
        enum_ls,
        file::{export, import, set_default_file},
    },
    state::{clear_ownerless, get_tauri_version, remove_kc, view_locker},
    table::{get_algo_by_days, get_algo_db, get_bonuses},
    unit::{delete_unit, get_unit, get_units, new_unit, save_units},
    validator::{validate, validate_slots},
};
use requirement::types::DatabaseRequirement;
use state::types::{Computed, JSONStorage, KeychainTable, UserJSON};
use std::sync::Mutex;
#[allow(unused_imports)]
use tauri::Manager;
use unit::types::Unit;

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
            algo_set_fill,
            algo_piece_new,
            algo_slots_compute,
            default_slot_size,
            main_stat_all,
            print_algo,
            print_main_stats,
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
            // requirement_algo, // TODO: conflict with Dese
            requirement_algo_store,
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
            get_units,
            new_unit,
            delete_unit,
            save_units,
            get_unit,
            // validator
            validate_slots,
            validate,
            // worker
            get_tauri_version,
            algo_req_group_piece
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
