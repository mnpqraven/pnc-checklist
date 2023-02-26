pub mod crud;
use crate::{
    algorithm::types::AlgoPiece,
    loadout::types::LoadoutType,
    prisma::{self, PrismaClient},
    unit::types::{Class, Unit},
};
use prisma_client_rust::QueryError;
use rspc::{Config, Error, ErrorCode, Router, RouterBuilder};
use std::{path::PathBuf, sync::Arc};

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
        .query("loadoutByUnitId", |t| {
            t(|ctx, unit_id: String| async move {
                ctx.client
                    .loadout()
                    .find_many(vec![prisma::loadout::unit_id::equals(unit_id.clone())])
                    .exec()
                    .await
                    .map_err(error_map)
            })
        })
        .query("skillLevelByUnitId", |t| {
            t(
                |ctx, (unit_id, loadout_type): (String, LoadoutType)| async move {
                    get_skill_level(&ctx.client, unit_id, loadout_type)
                        .await
                        .map_err(error_map)
                },
            )
        })
        .query("err", |t| { // NOTE: dev err
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

async fn get_skill_level(
    client: &PrismaClient,
    unit_id: String,
    loadout_type: LoadoutType,
) -> Result<prisma::unit_skill::Data, QueryError> {
    let loadout = client
        .loadout()
        .find_first(vec![
            prisma::loadout::unit_id::equals(unit_id),
            prisma::loadout::loadout_type::equals(loadout_type.to_string()),
        ])
        .exec()
        .await?;
    let loadout_id: String = match loadout {
        Some(loadout) => loadout.id,
        None => panic!("should have at least one skill level entry for every loadout table"),
    };
    let returned = client
        .unit_skill()
        .find_unique(prisma::unit_skill::loadout_id::equals(loadout_id))
        .exec()
        .await?;
    Ok(returned.unwrap())
}
