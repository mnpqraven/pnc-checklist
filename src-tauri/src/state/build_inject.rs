use super::{get_tauri_version, ENDPOINT_PATH, PUB_SIGNATURE, TAURI_CONF_PATH};
use chrono::{DateTime, Utc};
use regex::Regex;
use semver::Version;
use serde::{Deserialize, Serialize};
use std::{error::Error, fs};

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
        let replaced = _semver_regex().replace_all(&self._get_url().0, to_version.to_string());
        *self._get_url_mut() = Url(replaced.to_string());
    }
}

fn _semver_regex() -> Regex {
    Regex::new(r"\d+\.\d+\.\d+").unwrap()
}

pub(super) fn _get_payload() -> Result<EndPointPayload, serde_json::Error> {
    let buffer = fs::read_to_string(ENDPOINT_PATH).unwrap();
    serde_json::from_str::<EndPointPayload>(&buffer)
}

pub(super) fn _build_payload(
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

pub(super) fn _write_endpoint(
    path: &str,
    payload: &EndPointPayload,
) -> Result<(), Box<dyn Error>> {
    let pretty_json = serde_json::to_string_pretty::<EndPointPayload>(payload).unwrap();
    fs::write(path, pretty_json)?;
    Ok(())
}

pub(super) fn _update_tauri_conf() -> Result<(), Box<dyn Error>> {
    let mut buffer = String::new();
    let to_version = get_tauri_version().unwrap().to_string();
    let mut replaced = false;

    for line in fs::read_to_string(TAURI_CONF_PATH)?.lines() {
        // first line containing 'version'
        if line.contains("version") && !replaced {
            // to replacement
            let modified = _semver_regex().replace_all(line, to_version.clone());
            buffer.push_str(&modified);
            replaced = true;
        } else {
            buffer.push_str(line);
        }
        buffer.push('\n');
    }
    fs::write(TAURI_CONF_PATH, buffer)?;

    Ok(())
}
