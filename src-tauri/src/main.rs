#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod api;
mod model;
mod parser;
mod screen;
mod startup;
mod validate;
use tauri::Manager;

use crate::api::builder::{save_unit, view_store_units, new_unit, default_slot_size, algo_piece_new, algorithm_all, algo_set_new, update_chunk, get_needed_rsc, save_units};
use crate::model::impls::main_stat_all;
use crate::model::tables::{get_bonuses, generate_algo_db, get_algo_by_days};
use crate::parser::file::{import, export, set_default_file};
use crate::parser::parse::get_algo_types;
use crate::parser::requirement::{requirement_slv, requirement_level, requirement_neural};
use crate::validate::validate;

// will be invoked during startup
use crate::startup::*;

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
            store: Default::default(),
            database_req: Default::default(),
            db: Default::default()
        })
        .invoke_handler(tauri::generate_handler![
            // TODO: refactor dir structure
            // ref http://wiki.42lab.cloud/w/%E9%A6%96%E9%A1%B5
            // assets for items http://wiki.42lab.cloud/w/%E9%81%93%E5%85%B7
            // figure out validation return on frontend home
            // auto read json in data_dir
            // actual logging to frontend
            // rsc page inventory for frontend

            // file
            import,
            export,
            set_default_file,
            // startup
            import_userdata,
            // builder
            update_chunk,
            new_unit,
            save_unit,
            save_units,
            view_store_units,
            // requirement
            requirement_slv,
            requirement_level,
            requirement_neural,
            // table
            get_bonuses,
            default_slot_size,
            algo_set_new,
            algo_piece_new,
            main_stat_all,
            get_needed_rsc,
            algorithm_all,
            get_algo_types,
            generate_algo_db,
            get_algo_by_days,
            // validator
            validate,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
