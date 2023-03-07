pub mod crud;
use crate::{
    algorithm::types::{AlgoMainStat, AlgoPiece, Algorithm},
    loadout::types::LoadoutType,
    prisma::{self, algo_piece, loadout, PrismaClient},
    unit::types::{Class, Unit},
};
use prisma_client_rust::QueryError;
use rspc::{Config, Error, ErrorCode, Router, RouterBuilder};
use std::{path::PathBuf, sync::Arc};
use strum::IntoEnumIterator;

use self::crud::unit::{delete_unit, get_unit_from_id, get_units, new_unit};

pub struct Ctx {
    pub client: Arc<prisma::PrismaClient>,
}

fn error_map(err: QueryError) -> rspc::Error {
    rspc::Error::with_cause(rspc::ErrorCode::InternalServerError, err.to_string(), err)
}
pub(crate) fn new() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new()
        .config(Config::new().export_ts_bindings(
            PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../src-tauri/bindings/rspc.ts"),
        ))
        .query("version", |t| t(|_, _: ()| env!("CARGO_PKG_VERSION")))
        // INFO: UNIT
        .mutation("newUnit", |t| {
            t(|ctx, (name, class): (String, Class)| async move {
                let unit = Unit::new(name, class);
                new_unit(&ctx.client, unit).await.map_err(error_map)
            })
        })
        .mutation("deleteUnit", |t| {
            t(|ctx, unit_id: String| async move {
                delete_unit(&ctx.client, unit_id).await.map_err(error_map)
            })
        })
        .query("getUnits", |t| {
            t(|ctx, _: ()| async move { get_units(&ctx.client).await.map_err(error_map) })
        })
        .query("getUnitFromId", |t| {
            t(|ctx, unit_id: String| async move {
                get_unit_from_id(&ctx.client, unit_id)
                    .await
                    .map_err(error_map)
            })
        })
        // INFO: LOADOUT
        .query("loadouts", |t| {
            t(|ctx, loadout_id: Option<String>| async move {
                let pat = match loadout_id {
                    Some(id) => vec![loadout::id::equals(id)],
                    None => vec![],
                };
                ctx.client
                    .loadout()
                    .find_many(pat)
                    .exec()
                    .await
                    .map_err(error_map)
            })
        })
        .query("loadoutByUnitId", |t| {
            t(|ctx, unit_id: Option<String>| async move {
                let pat = match unit_id {
                    Some(id) => vec![prisma::loadout::unit_id::equals(id)],
                    None => vec![],
                };
                ctx.client
                    .loadout()
                    .find_many(pat)
                    .exec()
                    .await
                    .map_err(error_map)
            })
        })
        // INFO: SKILLLEVEL
        .query("skillLevelsByUnitIds", |t| {
            t(|ctx, unit_ids: Option<Vec<String>>| async move {
                get_skill_levels(&ctx.client, unit_ids)
                    .await
                    .map_err(error_map)
            })
        })
        // INFO: ALGOPIECE
        .query("algoPiecesByLoadoutId", |t| {
            t(|ctx, loadout_ids: Option<Vec<String>>| async move {
                let pat = match loadout_ids {
                    Some(ids) => vec![algo_piece::loadout_id::in_vec(ids)],
                    None => vec![],
                };
                ctx.client
                    .algo_piece()
                    .find_many(pat)
                    .with(algo_piece::loadout::fetch())
                    .exec()
                    .await
                    .map_err(error_map)
            })
        })
        // INFO: SLOT
        .query("slotsByAlgoPieceIds", |t| {
            t(|ctx, algo_piece_ids: Option<Vec<String>>| async move {
                get_slots(&ctx.client, algo_piece_ids)
                    .await
                    .map_err(error_map)
            })
        })
        // INFO: ENUMS
        .query("listLoadoutType", |t| {
            t(|_, _: ()| async move {
                LoadoutType::iter()
                    .map(|e| format!("{}", e))
                    .collect::<Vec<String>>()
            })
        })
        .query("displayLoadoutType", |t| {
            t(|_, _: ()| async move { LoadoutType::iter().collect::<Vec<LoadoutType>>() })
        })
        .query("listAlgorithm", |t| {
            t(|_, _: ()| async move {
                Algorithm::iter()
                    .map(|e| format!("{}", e))
                    .collect::<Vec<String>>()
            })
        })
        .query("displayAlgorithm", |t| {
            t(|_, _: ()| async move { Algorithm::iter().collect::<Vec<Algorithm>>() })
        })
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
        .query("err", |t| {
            // NOTE: dev err
            t(|_, _: ()| {
                // Rust is unable to infer the `Ok` variant of the result.
                // We use the `as` keyword to tell Rust the type of the result.
                // This situation is rare in real world code.
                Err(Error::new(
                    ErrorCode::BadRequest,
                    "This is a custom error!".into(),
                )) as Result<String, _ /* Rust can infer the error type */>
            })
        })
}

async fn get_skill_levels(
    client: &PrismaClient,
    unit_ids: Option<Vec<String>>,
) -> Result<Vec<prisma::unit_skill::Data>, QueryError> {
    let pat = match unit_ids {
        Some(ids) => vec![prisma::loadout::unit_id::in_vec(ids)],
        None => vec![],
    };
    let loadout_ids = client
        .loadout()
        .find_many(pat)
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
