use std::str::FromStr;
use crate::model::enums::*;
use crate::enum_list;
use cmdbindings::{gen_vec, AllEnums};

pub mod cmdbindings;
pub mod enums;
pub mod error;
pub mod structs;

#[tauri::command]
/// produces enum as an array
pub fn enum_ls(name: &str) -> Vec<String> {
    enum_list!(
        name,
        Class,
        Algorithm,
        Day,
        Bonus,
        AlgoMainStat,
        AlgoSubStat,
        AlgoCategory,
        NeuralExpansion,
        LoadoutType
    )
}
