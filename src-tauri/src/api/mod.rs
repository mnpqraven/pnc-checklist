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
    enums::{enum_pretty_router, enum_rust_router},
    loadout::{loadout_many_router, loadout_router},
    requirement::requirement_router,
    slot::{slot_many_router, slot_router},
    unit::{unit_many_router, unit_router},
    unitskill::{unit_skill_many_router, unit_skill_router},
};
use crate::{
    algorithm::types::{AlgoMainStat, AlgoPiece},
    prisma::{self, PrismaClient},
};
use prisma_client_rust::QueryError;
use rspc::{Config, Router, RouterBuilder};
use std::{path::PathBuf, sync::Arc};
use strum::IntoEnumIterator;

pub struct Ctx {
    pub client: Arc<prisma::PrismaClient>,
}

fn error_map(err: QueryError) -> rspc::Error {
    rspc::Error::with_cause(rspc::ErrorCode::InternalServerError, err.to_string(), err)
}

pub(crate) fn init_router() -> Arc<Router<Ctx>> {
    new()
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
        .merge("enum.rust.", enum_rust_router())
        .merge("enum.pretty.", enum_pretty_router())
        .merge("requirements.", requirement_router())
        .build()
        .arced()
}

pub fn new() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new()
        .config(Config::new().export_ts_bindings(
            PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../src-tauri/bindings/rspc.ts"),
        ))
        .query("version", |t| t(|_, _: ()| env!("CARGO_PKG_VERSION")))
        // INFO: ENUMS
        .query("listAlgoMainstat", |t| {
            t(|_, mainstats: Option<Vec<AlgoMainStat>>| async move {
                match mainstats {
                    Some(stats) => stats
                        .iter()
                        .map(|e| format!("{}", e))
                        .collect::<Vec<String>>(),
                    None => AlgoMainStat::iter()
                        .map(|e| format!("{}", e))
                        .collect::<Vec<String>>(),
                }
            })
        })
        .query("displayAlgoMainstat", |t| {
            t(|_, _: ()| async move { AlgoMainStat::iter().collect::<Vec<AlgoMainStat>>() })
        })
}

async fn get_skill_levels(
    client: &PrismaClient,
    unit_ids: Vec<String>,
) -> Result<Vec<prisma::unit_skill::Data>, QueryError> {
    let loadout_ids = client
        .loadout()
        .find_many(vec![prisma::loadout::unit_id::in_vec(unit_ids)])
        .exec()
        .await?
        .iter()
        .map(|e| e.id.clone())
        .collect();
    client
        .unit_skill()
        .find_many(vec![prisma::unit_skill::loadout_id::in_vec(loadout_ids)])
        .exec()
        .await
}

async fn get_slots(
    client: &PrismaClient,
    algo_piece_ids: Option<Vec<String>>,
) -> Result<Vec<prisma::slot::Data>, QueryError> {
    let pat = match algo_piece_ids {
        Some(ids) => vec![prisma::slot::algo_piece_id::in_vec(ids)],
        None => vec![],
    };
    client.slot().find_many(pat).exec().await
}
