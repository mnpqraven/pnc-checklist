#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod model;
mod parser;
mod screen;
mod startup;
use tauri::Manager;

use crate::model::builder::{default_slot_size, new_unit, save_unit, view_store_units};
use crate::model::impls::{algo_piece_new, algo_set_new, algorithm_all, main_stat_all, get_needed_rsc};
use crate::model::validate::validate_algo;
use crate::parser::parse::get_algo_types;
use crate::parser::{calc::requirement_slv, parse::get_timetable};

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
            // startup
            import_userdata,
            import_userdata_schemaless,
            new_unit,
            save_unit,
            view_store_units,
            // common
            requirement_slv,
            get_timetable,
            default_slot_size,
            algo_set_new,
            algo_piece_new,
            get_algo_types,
            main_stat_all,
            algorithm_all,
            validate_algo,
            get_needed_rsc
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
