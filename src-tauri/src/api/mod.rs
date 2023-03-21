mod algopiece;
pub mod crud;
mod enums;
mod loadout;
mod requirement;
mod slot;
mod unit;
mod unitskill;

use self::{
    algopiece::{algo_piece_many_router, algo_piece_router},
    enums::enum_router,
    loadout::{loadout_many_router, loadout_router},
    requirement::requirement_router,
    slot::{slot_many_router, slot_router},
    unit::{unit_many_router, unit_router},
    unitskill::{unit_skill_many_router, unit_skill_router},
};
use crate::prisma;
use prisma_client_rust::QueryError;
use rspc::{Config, Router};
use std::{path::PathBuf, sync::Arc};

pub struct Ctx {
    pub client: Arc<prisma::PrismaClient>,
}

fn error_map(err: QueryError) -> rspc::Error {
    rspc::Error::with_cause(rspc::ErrorCode::InternalServerError, err.to_string(), err)
}

pub(crate) fn init_router() -> Arc<Router<Ctx>> {
    Router::<Ctx>::new()
        .config(Config::new().export_ts_bindings(
            PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../src-tauri/bindings/rspc.ts"),
        ))
        .query("version", |t| t(|_, _: ()| env!("CARGO_PKG_VERSION")))
        .merge("unit.", unit_router())
        .merge("units.", unit_many_router())
        .merge("loadout.", loadout_router())
        .merge("loadouts.", loadout_many_router())
        .merge("unitSkill.", unit_skill_router())
        .merge("unitSkills.", unit_skill_many_router())
        .merge("algoPiece.", algo_piece_router())
        .merge("algoPieces.", algo_piece_many_router())
        .merge("slot.", slot_router())
        .merge("slots.", slot_many_router())
        .merge("enum.", enum_router())
        .merge("requirements.", requirement_router())
        .build()
        .arced()
}
