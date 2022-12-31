use std::{fs, path::Path};

use tauri::State;

use crate::{model::infomodel::ImportChunk, startup::Storage, validate::TauriError};

#[tauri::command]
pub fn import(path: String) -> Result<ImportChunk, TauriError> {
    println!("import");
    let file = fs::read_to_string(path.clone());
    match file {
        Ok(payload) => match serde_json::from_str::<ImportChunk>(&payload) {
            Ok(valid_data) => {
                // generate new json in cache dir
                return Ok(valid_data);
            }
            Err(e) => return Err(TauriError::ImportStructError(e.to_string())),
        },
        Err(_) => Err(TauriError::ImportPathError(path)),
    }
}

#[tauri::command]
pub fn export(path: &str, store: State<Storage>) -> Result<(), TauriError> {
    let store = store.store.lock().unwrap();
    let new_path = Path::new(path).join("pnc-database.json");
    let t =
        serde_json::to_string_pretty(&*store).expect("can't convert ImportChunk struct to string");
    println!("{:?}", t);
    fs::write(new_path, t).expect("cannot write to file");
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::{export, import};

    #[test]
    fn import_verbose() {
        import("/home/othi/dev_env/rust-local/pnc-checklist/testjson.json".to_string()).unwrap();
    }
}
