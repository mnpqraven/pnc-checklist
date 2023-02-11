use super::{PUB_SIGNATURE, TAURI_CONF};
use chrono::{DateTime, Utc};
use regex::Regex;
use semver::Version;
use serde::{Deserialize, Serialize};
use serde_json::Value;
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
    fn get_ver(&self) -> Version {
        self.version.clone()
    }

    fn get_url(&self) -> &Url {
        &self.platforms.windows.url
    }

    fn get_url_mut(&mut self) -> &mut Url {
        &mut self.platforms.windows.url
    }

    fn update_url(&mut self, to_version: &Version) {
        let re_url = Regex::new(r"\d.\d.\d").unwrap();
        let replaced = re_url.replace_all(&self.get_url().0, to_version.to_string());
        *self.get_url_mut() = Url(replaced.to_string());
    }

    fn get_platforms(&self) -> Platforms {
        self.platforms.clone()
    }
}

pub(super) fn get_payload(path: String) -> Result<EndPointPayload, serde_json::Error> {
    let buffer = fs::read_to_string(Path::new(&path)).unwrap();
    serde_json::from_str::<EndPointPayload>(&buffer)
}

fn get_tauri_version() -> Result<Version, Box<dyn Error>> {
    let buffer = fs::read_to_string(Path::new(&TAURI_CONF)).unwrap();
    let val: Value = serde_json::from_str(&buffer)?;
    let version = val["package"]["version"].to_string();

    Ok(Version::parse(version.trim_matches('\"'))?)
}

pub(super) fn build_payload(
    mut current: EndPointPayload,
) -> Result<EndPointPayload, serde_json::Error> {
    let pub_date: DateTime<Utc> = Utc::now();
    let version = get_tauri_version().unwrap();
    current.update_url(&version);
    let platforms = Platforms {
        windows: Endpoint {
            signature: PUB_SIGNATURE.to_string(),
            url: current.get_url().clone(),
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

#[cfg(test)]
mod tests {
    use semver::{BuildMetadata, Prerelease};

    use super::*;

    #[test]
    fn regex_and_update() {
        let re_url = Regex::new(r"\d.\d.\d").unwrap();
        let mut t = get_payload(super::super::ENDPOINT.to_string()).unwrap();
        assert_eq!(t.get_ver().to_string(), "0.1.3");

        {
            let captured = re_url.captures(&t.get_url().0).unwrap().get(0).unwrap();
            assert_eq!(captured.as_str(), "0.1.3");
        }
        t.update_url(&Version {
            major: 0,
            minor: 1,
            patch: 5,
            pre: Prerelease::EMPTY,
            build: BuildMetadata::EMPTY,
        });
        let captured = re_url.captures(&t.get_url().0).unwrap().get(0).unwrap();
        assert_eq!(captured.as_str(), "0.1.5");
    }

    #[test]
    fn build() {
        let t = get_payload(super::super::ENDPOINT.to_string()).unwrap();
        let next_version = Version {
            major: 0,
            minor: 1,
            patch: 5,
            pre: Prerelease::EMPTY,
            build: BuildMetadata::EMPTY,
        };
        let next = build_payload(t).unwrap();
        assert_eq!(next.version.to_string(), "0.1.5");
        assert_eq!(next.platforms.windows.url.0, "https://github.com/mnpqraven/pnc-checklist/releases/download/0.1.5/pnc-checklist_0.1.5_x64_en-US.msi.zip");
    }
}
