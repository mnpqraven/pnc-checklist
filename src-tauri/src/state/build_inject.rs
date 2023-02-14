use crate::state::TauriError;
use chrono::{DateTime, Utc};
use regex::Regex;
use semver::Version;
use serde::{Deserialize, Serialize};
use std::path::Path;
use std::{error::Error, fs};

use super::{TAURI_CONF, PUB_SIGNATURE};

#[derive(Serialize, Deserialize, Debug)]
pub struct EndPointPayload {
    pub version: Version,
    pub notes: String,
    pub pub_date: DateTime<Utc>,
    pub platforms: Platforms,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Platforms {
    #[serde(rename = "windows-x86_64")]
    pub windows: Endpoint,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Endpoint {
    pub signature: String,
    pub url: Url,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Url(pub String);

impl EndPointPayload {
    fn _get_ver(&self) -> Version {
        self.version.clone()
    }

    fn _get_url(&self) -> &Url {
        &self.platforms.windows.url
    }

    fn _get_url_mut(&mut self) -> &mut Url {
        &mut self.platforms.windows.url
    }

    fn _update_url(&mut self, to_version: &Version) {
        let re_url = Regex::new(r"\d.\d.\d").unwrap();
        let replaced = re_url.replace_all(&self._get_url().0, to_version.to_string());
        *self._get_url_mut() = Url(replaced.to_string());
    }
}

pub(super) fn _get_payload(path: String) -> Result<EndPointPayload, serde_json::Error> {
    let buffer = fs::read_to_string(Path::new(&path)).unwrap();
    serde_json::from_str::<EndPointPayload>(&buffer)
}

#[tauri::command]
pub fn get_tauri_version() -> Result<Version, TauriError> {
    let ver = env!("CARGO_PKG_VERSION");

    match Version::parse(ver.trim_matches('\"')) {
        Ok(version) => Ok(version),
        Err(_) => Err(TauriError::ResourceRequestFailed("version".to_string())),
    }
}

pub fn _build_payload(
    mut current: EndPointPayload,
) -> Result<EndPointPayload, serde_json::Error> {
    let pub_date: DateTime<Utc> = Utc::now();
    let version = get_tauri_version().unwrap();
    current._update_url(&version);
    let platforms = Platforms {
        windows: Endpoint {
            // find target sig first, else use this
            signature: PUB_SIGNATURE.to_string(),
            url: current._get_url().clone(),
        },
    };

    let out_payload = EndPointPayload {
        version,
        notes: "Version bump".to_string(),
        pub_date,
        platforms,
    };

    Ok(out_payload)
}

pub fn write_endpoint(path: String, payload: &EndPointPayload) -> Result<(), Box<dyn Error>> {
    let pretty_json = serde_json::to_string_pretty::<EndPointPayload>(payload).unwrap();
    fs::write(path, pretty_json).unwrap();
    Ok(())
}
pub(super) fn _update_tauri_conf() -> Result<(), Box<dyn Error>> {
    let conf = fs::read_to_string(TAURI_CONF).unwrap();
    // let ind = conf.find("version").unwrap() + "version".to_string().len() + 1;
    let mut buffer = String::new();
    let re_url = Regex::new(r"\d.\d.\d").unwrap();
    let to_version = get_tauri_version().unwrap().to_string();
    let mut replaced = false;

    for line in conf.lines() {
        if line.contains("version") && !replaced {
            // to replacement
            let modified = re_url.replace_all(line, to_version.clone());
            buffer.push_str(&modified);
            replaced = true;
        } else {
            buffer.push_str(line);
        }
        buffer.push('\n');
    }
    fs::write(TAURI_CONF, buffer).unwrap();

    Ok(())
}
