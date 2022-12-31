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

use crate::api::builder::{save_unit, view_store_units, new_unit, default_slot_size, algo_piece_new, algorithm_all, algo_set_new, update_chunk, get_needed_rsc};
use crate::model::impls::main_stat_all;
use crate::parser::calc::requirement_slv;
use crate::parser::file::{import, export};
use crate::parser::parse::{get_timetable, get_algo_types};
use crate::validate::validate;

// will be invoked during startup
use crate::startup::*;

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
            database_req: Default::default(),
            db: Default::default()
        })
        .invoke_handler(tauri::generate_handler![
            // TODO: refactor dir structure
            // figure out validation return on frontend home
            // HOME:
            // algo day + x2 table
            // clock (timezone from os, server from settings TODO: schema update)
            //
            // ref http://wiki.42lab.cloud/w/%E9%A6%96%E9%A1%B5

            // file
            import,
            export,
            // startup
            import_userdata,
            import_userdata_schemaless,
            // builder
            update_chunk,
            new_unit,
            save_unit,
            view_store_units,
            // common
            requirement_slv,
            get_timetable,
            default_slot_size,
            algo_set_new,
            algo_piece_new,
            main_stat_all,
            get_needed_rsc,
            algorithm_all,
            get_algo_types,
            // validator
            validate,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
