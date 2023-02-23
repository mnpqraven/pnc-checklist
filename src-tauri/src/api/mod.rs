use crate::prisma;
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
        // .query("algorithms", |t| {
        //     t(|ctx, _: ()| async move {
        //         let algorithms = ctx.client.algorithm().find_many(vec![]).exec().await?;
        //         Ok(algorithms)
        //     })
        // })
}
