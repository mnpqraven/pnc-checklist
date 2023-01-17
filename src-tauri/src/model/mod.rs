use std::str::FromStr;
use crate::model::enums::*;
use crate::enum_list;
use cmdbindings::{gen_vec, AllEnums};

pub mod cmdbindings;
pub mod error;

// INFO: run tests to genrate bindings
pub mod enums;
pub mod structs;
#[cfg(test)]
mod indexbindings {
    use crate::model::cmdbindings::*;
    #[test]
    fn generate_index() {
        write_index_binding::<AllEnums>(Folder::Enums).unwrap();
        write_index_binding::<AllStructs>(Folder::Structs).unwrap();
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
        LoadoutType
    )
}
