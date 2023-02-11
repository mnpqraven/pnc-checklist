use chrono::{DateTime, Utc};
use semver::Version;
use std::{error::Error, fs, path::Path};

struct EndPointPayload {
    version: Version,
    notes: String,
    pub_date: DateTime<Utc>,
    // platform: Platform,
}
const ENDPOINT: &'static str = "endpoint.json";