#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod api;
mod impls;
mod macros;
mod model;
mod parser;
mod state;
mod validate;
use tauri::Manager;

use crate::api::builder::{
    algo_piece_new, algo_set_new, algo_slots_compute, algorithm_all, default_slot_size,
    generate_algo_db, get_algo_by_days, get_needed_rsc, new_unit, save_units, update_chunk,
    view_store_units, get_bonuses, get_algo_types,
};
use crate::model::cmdbindings::enum_ls;
use crate::model::impls::main_stat_all;
use crate::parser::file::{export, import, set_default_file};
use crate::parser::requirement::{
    requirement_level, requirement_neural, requirement_slv, requirement_widget,
    requirment_neural_kits,
};
use crate::validate::validate;

// will be invoked during startup
use crate::state::*;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .manage(Storage {
            // JSON data
            store: Default::default(),
            db: Default::default(),
            // updated post launch
            // NOTE: should put in separate state ?
            // database_req: Default::default(),
        })
        .manage(Computed {
            database_req: Default::default(),
        })
        .invoke_handler(tauri::generate_handler![
            // TODO: refactor dir structure
            // ref http://wiki.42lab.cloud/w/%E9%A6%96%E9%A1%B5
            // assets for items http://wiki.42lab.cloud/w/%E9%81%93%E5%85%B7
            // figure out validation return on frontend home
            // actual logging to frontend
            // rsc page inventory for frontend
            // relative search ? TBD

            // file
            import,
            export,
            set_default_file,
            // builder
            update_chunk,
            get_bonuses,
            new_unit,
            save_units,
            view_store_units,
            generate_algo_db,
            get_algo_by_days,
            // requirement
            requirement_slv,
            requirement_level,
            requirement_neural,
            requirement_widget,
            requirment_neural_kits,
            // table
            default_slot_size,
            algo_set_new,
            algo_piece_new,
            main_stat_all,
            get_needed_rsc,
            algorithm_all,
            get_algo_types,
            // api
            algo_slots_compute,
            enum_ls,
            // validator
            validate,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
