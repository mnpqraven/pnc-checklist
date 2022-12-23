#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod model;
mod parser;
mod screen;
mod startup;
use tauri::Manager;

use crate::model::builder::{new_unit, save_unit, default_slot_vec, algo_set_new};
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
        .invoke_handler(tauri::generate_handler![
            // startup
            import_userdata,
            import_userdata_schemaless,
            new_unit,
            save_unit,
            // common
            calc_slv, get_timetable,
            default_slot_vec, algo_set_new
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
