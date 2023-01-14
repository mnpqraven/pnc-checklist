#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod algorithm;
mod compute;
mod loadout;
mod macros;
mod model;
mod requirement;
mod service;
mod state;
mod table;
mod unit;
mod validator;
use model::cmdbindings::{write_index_binding, AllEnums, AllStructs, Folder};
use tauri::Manager;

// will be invoked during startup
use crate::{
    algorithm::{
        algo_piece_new, algo_set_new, algo_slots_compute, algorithm_all, default_slot_size,
        get_algo_by_days, main_stat_all,
    },
    compute::{get_needed_rsc, update_chunk},
    model::enum_ls,
    requirement::{
        requirement_level, requirement_neural, requirement_slv, requirement_widget,
        requirment_neural_kits,
    },
    service::file::{export, import, set_default_file},
    state::*,
    table::{generate_algo_db, get_bonuses},
    unit::{delete_unit, new_unit, save_units, view_store_units},
    validator::validate,
};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
fn main() {
    // update TS binding index
    write_index_binding::<AllEnums>(Folder::Enums).unwrap();
    write_index_binding::<AllStructs>(Folder::Structs).unwrap();
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
            // INFO:
            // ref http://wiki.42lab.cloud/w/%E9%A6%96%E9%A1%B5
            // assets for items http://wiki.42lab.cloud/w/%E9%81%93%E5%85%B7
            // TODO:
            // figure out validation return on frontend home
            // actual logging to frontend
            // rsc page inventory for frontend
            // relative search ? TBD

            // algorithm
            algorithm_all,
            algo_set_new,
            algo_piece_new,
            algo_slots_compute,
            default_slot_size,
            get_algo_by_days, // probably move to table mod
            main_stat_all,
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
            // service
            import,
            export,
            set_default_file,
            // table
            generate_algo_db,
            get_bonuses,
            // unit
            view_store_units,
            new_unit,
            delete_unit,
            save_units,
            // validator
            validate
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
