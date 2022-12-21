#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod model;
mod parser;
mod screen;
use tauri::Manager;

use crate::{parser::{calc::calc_slv, parse::get_timetable}};

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
        .invoke_handler(tauri::generate_handler![calc_slv, get_timetable])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
