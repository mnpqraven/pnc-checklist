#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod model;
mod parser;
mod screen;
mod startup;
use tauri::Manager;

use crate::model::builder::{algo_set_new, new_unit, save_unit, view_store_units, default_slot_size};
use crate::model::impls::{algorithm_all, main_stat_all};
use crate::model::validate::validate_algo;
use crate::parser::parse::get_algo_types;
use crate::parser::{calc::calc_slv, parse::get_timetable};

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
        .manage(Storage { store: Default::default(), })
        .invoke_handler(tauri::generate_handler![
            // startup
            import_userdata,
            import_userdata_schemaless,
            new_unit,
            save_unit,
            view_store_units,
            // common
            calc_slv,
            get_timetable,
            default_slot_size,
            algo_set_new,
            get_algo_types,
            main_stat_all,
            algorithm_all,
            validate_algo
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
