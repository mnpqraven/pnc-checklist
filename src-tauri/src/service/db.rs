use crate::prisma;
use crate::prisma::PrismaClient;

use std::{
    fs::{create_dir_all, File},
    path::{Path, PathBuf},
    sync::Arc,
};
use tauri::api::path::data_dir;

/// gets the path of the database (in development) and the db url
/// format should be /home/.../pnc-checklist/database.db for linux
/// and /C:/.../pnc-checklist/database.db for windows
pub fn db_path_url() -> (PathBuf, String) {
    let binding = data_dir().unwrap().join("PNCChecklist").join("database.db");
    let db_path = binding.to_str().unwrap();
    let db_url = format!("file:{db_path}");

    (db_path.into(), db_url)
}

/// Prepares the db before development or production by running migration
/// command or `db push`
/// Reference: https://prisma.brendonovich.dev/extra/migrations
pub async fn load_and_migrate(_db_path: &Path, _db_url: &str) -> Arc<PrismaClient> {
    let db_dir = _db_path.parent().unwrap();
    if !db_dir.exists() {
        create_dir_all(db_dir).unwrap()
    }
    if !_db_path.exists() {
        File::create(_db_path).unwrap();
    }

    // let client = prisma::new_client_with_url(db_url).await.unwrap();
    #[cfg(debug_assertions)]
    let client = prisma::new_client().await.unwrap();
    #[cfg(not(debug_assertions))]
    let client = prisma::new_client_with_url(db_url).await.unwrap();

    #[cfg(debug_assertions)]
    client._db_push().await.unwrap();
    #[cfg(not(debug_assertions))]
    client._migrate_deploy().await.unwrap();

    Arc::new(client)
}

/// Produces a new PrismaClient to execute actions
#[cfg(not(debug_assertions))]
pub async fn get_db() -> PrismaClient {
    let (_, db_url) = db_path_url();
    prisma::new_client_with_url(&db_url)
        .await
        .expect("We should always be able to get a prisma client instance here")
}
#[cfg(debug_assertions)]
pub async fn get_db() -> Arc<PrismaClient> {
    let client = prisma::new_client()
        .await
        .expect("We should always be able to get a prisma client instance here");
    Arc::new(client)
}
