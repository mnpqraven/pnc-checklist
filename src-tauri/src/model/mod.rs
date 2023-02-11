use crate::table::types::{Bonus, Day};
use crate::{algorithm::types::Algorithm, unit::types::Class};
use crate::{
    algorithm::types::{AlgoCategory, AlgoMainStat, AlgoSubStat},
    enum_list,
    loadout::types::LoadoutType,
    unit::types::NeuralExpansion,
};
use cmdbindings::{gen_vec, AllEnums};
use std::str::FromStr;

pub mod cmdbindings;
pub mod error;

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
