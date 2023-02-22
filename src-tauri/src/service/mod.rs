use crate::service::databinding::{gen_vec, AllEnums};
use crate::{
    algorithm::types::{AlgoCategory, AlgoMainStat, AlgoSubStat, Algorithm, SlotPlacement},
    enum_list,
    loadout::types::LoadoutType,
    table::types::{Bonus, Day},
    unit::types::{Class, NeuralExpansion},
};
use std::str::FromStr;

#[cfg(test)]
mod bacon;
pub mod databinding;
pub mod errors;
pub mod file;
pub mod db;

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
        LoadoutType,
        SlotPlacement
    )
}
