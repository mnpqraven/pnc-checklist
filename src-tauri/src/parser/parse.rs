use crate::model::structs::{AlgoCategory, Algorithm};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct AlgoTypeDb {
    pub category: AlgoCategory,
    pub algos: Vec<Algorithm>,
}
#[tauri::command]
pub fn get_algo_types() -> Vec<AlgoTypeDb> {
    AlgoTypeDb::generate_algo_db()
}

#[cfg(test)]
mod tests {
    use crate::model::structs::UserStore;
    use std::fs;

    use super::get_algo_types;

    #[test]
    fn cat_test() {
        let v = get_algo_types();
        println!("{:?}", v);
    }
    #[test]
    fn import_test() {
        let file = fs::read_to_string("./data/user/schemadata.json")
            .expect("can't open file, check perm or path");
        let res: UserStore = serde_json::from_str(&file).expect("unable to parse");
        println!("{:?}", res);
    }

    #[test]
    fn export_test() {
        // TODO: export json from data
        // run after every unit save or database save
    }
}
