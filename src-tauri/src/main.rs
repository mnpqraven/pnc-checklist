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

use crate::api::builder::{
    algo_piece_new, algo_set_new, algorithm_all, default_slot_size, new_unit, save_unit,
    view_store_units,
};
use crate::model::impls::main_stat_all;
use crate::parser::parse::get_algo_types;
use crate::parser::{calc::calc_slv, parse::get_timetable};

// will be invoked during startup
use crate::startup::*;
use crate::validate::algo::validate_algo;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
// TODO: refactor functions
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
        })
        .invoke_handler(tauri::generate_handler![
            // startup
            import_userdata,
            import_userdata_schemaless,
            // builder
            new_unit,
            save_unit,
            view_store_units,
            default_slot_size,
            algo_set_new,
            algo_piece_new,
            main_stat_all,
            algorithm_all,
            validate_algo,
            // parser
            calc_slv,
            get_timetable,
            get_algo_types,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
