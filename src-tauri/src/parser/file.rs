use crate::model::error::TauriError;
use crate::{model::structs::UserStore, state::Storage};
use std::{fs, path::Path};
use tauri::{api::path::data_dir, State};

#[tauri::command]
pub fn import(path: String) -> Result<UserStore, TauriError> {
    println!("import");
    let file = fs::read_to_string(path);
    match file {
        Ok(payload) => match serde_json::from_str::<UserStore>(&payload) {
            Ok(valid_data) => {
                // generate new json in cache dir
                Ok(valid_data)
            }
            Err(e) => Err(TauriError::ImportStruct(e.to_string())),
        },
        Err(_) => {
            // folder doesn't exist in data_dir(), likely first time running
            let pnc_dir_data = &data_dir().unwrap().join("PNCChecklist");
            fs::create_dir_all(pnc_dir_data).unwrap();

            // create example chunk
            let example: UserStore = UserStore::generate_example();
            fs::write(
                Path::new(&pnc_dir_data.join("pnc_database.json")),
                serde_json::to_string_pretty(&example).unwrap(),
            )
            .unwrap();
            // path doesn't exist, using fallback example schemadata
            // Err(TauriError::ImportPath(path))
            // handled
            Ok(example)
        }
    }
}

#[tauri::command]
pub fn export(path: Option<&str>, store: State<Storage>) -> Result<(), TauriError> {
    let store = store.store.lock().unwrap();
    if let Some(path) = path {
        let new_path = Path::new(path).join("pnc_database.json");
        let t = serde_json::to_string_pretty(&*store)
            .expect("can't convert ImportChunk struct to string");
        println!("{:?}", t);
        fs::write(new_path, t).expect("cannot write to file");
    }
    // user cancelled export
    Ok(())
}

pub fn localsave(store: &UserStore) -> Result<(), TauriError> {
    // let store = store.store.lock().unwrap();
    let localjson = data_dir()
        .unwrap()
        .join("PNCChecklist")
        .join("pnc_database.json");
    let payload =
        serde_json::to_string_pretty(&store).expect("can't convert UserStore struct to string");
    println!("{:?}", payload);
    fs::write(Path::new(&localjson), payload).expect("cannot write to file");
    Ok(())
}
#[tauri::command]
pub fn set_default_file(_file: Option<&str>) -> Result<(), TauriError> {
    // TODO: "copy the selected file to $data_dir/pnc_database.json";
    // TODO: validation before check
    if let Some(filepath) = _file {
        let chunk = import(filepath.to_string()).unwrap();
        let t = serde_json::to_string_pretty(&chunk)
            .expect("can't convert ImportChunk struct to string");

        let pnc_dir =
            Path::new(&data_dir().expect("error finding data_dir()")).join("PNCChecklist");
        fs::create_dir_all(&pnc_dir).expect("failed creating dir");
        // write data
        fs::write(Path::new(&pnc_dir).join("pnc_database.json"), t)
            .expect("cannot write to data_dir()");
        // write pointer to data_dir for startup read
        // NOTE: not using, TBD
        // fs::write(Path::new(&pnc_dir).join("pointer"), filepath).unwrap();
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use std::fs;

    use super::import;

    #[test]
    fn import_verbose() {
        import("./data/user/schemadata.json".to_string()).unwrap();
    }

    #[test]
    fn import_fs() {
        fs::read_to_string("./data/user/schemadata.json".to_string()).unwrap();
    }
}
