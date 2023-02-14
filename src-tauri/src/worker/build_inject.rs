use super::{PUB_SIGNATURE, TAURI_CONF};
use crate::model::error::TauriError;
use chrono::{DateTime, Utc};
use regex::Regex;
use semver::Version;
use serde::{Deserialize, Serialize};
use std::path::Path;
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

pub fn write_endpoint(
    path: String,
    payload: &EndPointPayload,
) -> Result<(), Box<dyn Error>> {
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
            buffer.push_str(&modified.to_string());
            replaced = true;
        } else {
            buffer.push_str(line);
        }
        buffer.push_str("\n");
    }
    fs::write(TAURI_CONF, buffer).unwrap();

    Ok(())
}

#[cfg(test)]
mod tests {
    use semver::{BuildMetadata, Prerelease};

    use super::*;

    #[test]
    fn regex_and_update() {
        let re_url = Regex::new(r"\d.\d.\d").unwrap();
        let mut t = _get_payload(super::super::ENDPOINT.to_string()).unwrap();
        assert_eq!(t._get_ver().to_string(), "0.1.3");

        {
            let captured = re_url.captures(&t._get_url().0).unwrap().get(0).unwrap();
            assert_eq!(captured.as_str(), "0.1.3");
        }
        t._update_url(&Version {
            major: 0,
            minor: 1,
            patch: 5,
            pre: Prerelease::EMPTY,
            build: BuildMetadata::EMPTY,
        });
        let captured = re_url.captures(&t._get_url().0).unwrap().get(0).unwrap();
        assert_eq!(captured.as_str(), "0.1.5");
    }

    #[test]
    fn build() {
        let t = _get_payload(super::super::ENDPOINT.to_string()).unwrap();
        let next = _build_payload(t).unwrap();
        assert_eq!(next.version.to_string(), "0.1.5");
        assert_eq!(next.platforms.windows.url.0, "https://github.com/mnpqraven/pnc-checklist/releases/download/0.1.5/pnc-checklist_0.1.5_x64_en-US.msi.zip");
    }

    #[test]
    fn cargo_ver() {
        let ver = env!("CARGO_PKG_VERSION");
        println!("{}", ver);
    }
}
