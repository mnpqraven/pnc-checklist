use super::enums::*;
use crate::enum_list;
use std::{fmt::Debug, str::FromStr};
use strum::{EnumIter, EnumString, IntoEnumIterator};

#[derive(Debug, EnumIter, EnumString)]
enum All {
    Class,
    Algorithm,
    Day,
    Bonus,
    AlgoMainStat,
    AlgoSubStat,
    AlgoCategory,
    NeuralExpansion,
    LoadoutType
}

#[tauri::command]
/// produces enum as an array
pub fn enum_ls(name: &str) -> Vec<String> {
    enum_list!(
        &name,
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

/// Generate a string array containing field names in a rust enum
fn gen_vec<T>() -> Vec<String>
where
    T: IntoEnumIterator + Debug,
{
    let mut list: Vec<String> = Vec::new();
    for item in T::iter() {
        list.push(format!("{:?}", item))
    }
    list
}

#[cfg(test)]
mod tests {
    use crate::model::cmdbindings::enum_ls;
    use strum::{EnumIter, IntoEnumIterator};

    #[derive(Debug, EnumIter, PartialEq, Eq)]
    enum Direction {
        NORTH,
        SOUTH,
        EAST,
        WEST,
    }
    #[test]
    fn debug() {
        let t = enum_ls("Class");
        assert_eq!(t, vec!["Guard", "Medic", "Sniper", "Specialist", "Warrior"]);
    }
    #[test]
    fn playground() {
        let mut dirs: Vec<Direction> = Vec::new();
        for direction in Direction::iter() {
            dirs.push(direction);
        }
        assert_eq!(
            dirs,
            vec![
                Direction::NORTH,
                Direction::SOUTH,
                Direction::EAST,
                Direction::WEST,
            ]
        );
    }
}
