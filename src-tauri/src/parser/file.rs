use std::fs;

use crate::{model::infomodel::ImportChunk, validate::TauriError};

#[tauri::command]
pub fn import(path: String) -> Result<ImportChunk, TauriError> {
    println!("import");
    let file = fs::read_to_string(path);
    match file {
        Ok(payload) => match serde_json::from_str::<ImportChunk>(&payload) {
            Ok(valid_data) => return Ok(valid_data),
            Err(e) => return Err(TauriError::ImportStructError(e.to_string())),
        },
        Err(e) => Err(TauriError::ImportPathError(path)),
    }
}


#[tauri::command]
pub fn export(chunk: ImportChunk, path: &str) -> Result<(), TauriError> {
    let t =
        serde_json::to_string_pretty(&chunk).expect("can't convert ImportChunk struct to string");
    println!("{:?}", t);
    fs::write(path, t).expect("cannot write to file");
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::{export, import};
    use crate::model::infomodel::ImportChunk;

    #[test]
    fn export_verbose() {
        let t = ImportChunk::default();
        export(
            t,
            "/home/othi/dev_env/rust-local/pnc-checklist/testjson.json",
        )
        .unwrap();
    }

    #[test]
    fn import_verbose() {
        import("/home/othi/dev_env/rust-local/pnc-checklist/testjson.json".to_string()).unwrap();
    }
}
