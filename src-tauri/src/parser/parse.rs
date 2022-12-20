#[cfg(test)]
mod tests {
    use std::fs;

    use crate::model::infomodel::{ImportChunk, SchemalessImportChunk};

    #[test]
    fn import_test() {
        let file = fs::read_to_string("./schemadata.json")
        .expect("can't open file, check perm or path");
        let res: ImportChunk = serde_json::from_str(&file).expect("unable to parse");
        println!("{:?}", res);
    }
    #[test]
    fn import_schemaless_test() {
        let file = fs::read_to_string("./schemalessdata.json")
        .expect("can't open file, check perm or path");
        let res: SchemalessImportChunk = serde_json::from_str(&file).expect("unable to parse");
        println!("{:?}", res);
    }

    #[test]
    fn export_test() {
        // TODO: export json from data
    }
}