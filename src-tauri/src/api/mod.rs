mod crud;
use crate::{algorithm::types::AlgoPiece, prisma, unit::types::Unit};
use rspc::{Config, Router, RouterBuilder};
use std::{path::PathBuf, sync::Arc};

use self::crud::new_algo_piece;

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
        // .query("algorithms", |t| {
        //     t(|ctx, _: ()| async move {
        //         let algorithms = ctx.client.en_algorithm().find_many(vec![]).exec().await?;
        //         Ok(algorithms)
        //     })
        // })
        //
        // FIX: error with specta (Type not yet derived for AlgoPiece)
        .query("new_algo_piece", |t| {
            t(|ctx, data: AlgoPiece| async move {
                let created = new_algo_piece(&ctx.client, data).await?;
                Ok(created)
            })
        })
}
