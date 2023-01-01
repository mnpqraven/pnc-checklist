use serde::{Deserialize, Serialize};
use crate::model::infomodel::{AlgoCategory, Algorithm};

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
    use crate::model::infomodel::{ImportChunk, SchemalessImportChunk};
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
        let res: ImportChunk = serde_json::from_str(&file).expect("unable to parse");
        println!("{:?}", res);
    }
    #[test]
    fn import_schemaless_test() {
        let file = fs::read_to_string("./data/user/schemalessdata.json")
            .expect("can't open file, check perm or path");
        let res: SchemalessImportChunk = serde_json::from_str(&file).expect("unable to parse");
        println!("{:?}", res);
    }

    #[test]
    fn export_test() {
        // TODO: export json from data
    }
}
