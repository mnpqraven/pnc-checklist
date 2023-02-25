pub mod crud;
use crate::{
    algorithm::types::AlgoPiece,
    loadout::types::LoadoutType,
    prisma::{self, PrismaClient}, unit::types::Unit,
};
use prisma_client_rust::QueryError;
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
        .query("units", |t| {
            t(|ctx, _: ()| async move {
                let units = ctx
                    .client
                    .unit()
                    .find_many(vec![])
                    // .include(prisma::unit::include!({current goal}))
                    .exec()
                    .await?;
                Ok(units)
            })
        })
        .query("new_unit", |t| {
            t(|ctx, data: Unit| async move {
                Ok(crud::unit::new_unit(&ctx.client, data).await?)
            })
        })
        .query("loadoutByUnitId", |t| {
            t(|ctx, unit_id: String| async move {
                let loadouts = ctx
                    .client
                    .loadout()
                    .find_many(vec![prisma::loadout::unit_id::equals(unit_id.clone())])
                    .exec()
                    .await?;
                Ok(loadouts)
            })
        })
        .query("getSkillLevel", |t| {
            t(
                |ctx, (unit_id, loadout_type): (String, LoadoutType)| async move {
                    let skill = get_skill_level(&ctx.client, unit_id, loadout_type).await?;
                    Ok(skill)
                },
            )
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