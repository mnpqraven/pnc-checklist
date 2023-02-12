use crate::table::types::{Bonus, Day};
use crate::unit::types::Class;
use crate::{
    algorithm::types::{AlgoCategory, AlgoMainStat, AlgoSubStat, Algorithm, SlotPlacement},
    enum_list,
    loadout::types::LoadoutType,
    unit::types::NeuralExpansion,
};
use cmdbindings::{gen_vec, AllEnums};
use std::str::FromStr;

pub mod cmdbindings;
pub mod error;

#[cfg(test)]
mod indexbindings {
    use crate::model::cmdbindings::*;
    #[test]
    fn generate_index() {
        write_index_binding::<AllEnums>(Folder::Enums).unwrap();
        write_index_binding::<AllStructs>(Folder::Structs).unwrap();
        write_index_keys("Ivk", "bindings/invoke_keys.ts").unwrap();
    }
}

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
