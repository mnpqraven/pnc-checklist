pub mod crud;
use crate::{algorithm::types::AlgoPiece, prisma};
use rspc::{Config, Router, RouterBuilder};
use std::{path::PathBuf, sync::Arc};

pub struct Ctx {
    pub client: Arc<prisma::PrismaClient>,
}
pub(crate) fn new() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new()
        // TODO: change path
        .config(Config::new().export_ts_bindings(
            PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../src-tauri/bindings/rspc.ts"),
        ))
        .query("version", |t| t(|_, _: ()| env!("CARGO_PKG_VERSION")))
    // .query("new_algo_piece", |t| {
    //     t(|ctx, data: AlgoPiece| async move {
    //         let created = new_algo_piece(&ctx.client, data).await?;
    //         Ok(created)
    //     })
    // })
}
