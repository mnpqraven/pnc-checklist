pub mod crud;
use crate::{
    algorithm::types::AlgoPiece,
    loadout::types::LoadoutType,
    prisma::{self, PrismaClient},
    unit::types::{Unit, Class},
};
use prisma_client_rust::QueryError;
use rspc::{Config, Router, RouterBuilder};
use std::{path::PathBuf, sync::Arc};

use self::crud::unit::{get_unit_from_id, get_units, new_unit};

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
        // INFO: UNIT
        .mutation("newUnit", |t| {
            t(|ctx, (name, class): (String, Class)| async move {
                let unit = Unit::new(name, class);
                Ok(new_unit(&ctx.client, unit).await?)})
        })
        .query("getUnits", |t| {
            t(|ctx, _: ()| async move { Ok(get_units(&ctx.client).await?) })
        })
        .query("getUnitFromId", |t| {
            t(|ctx, unit_id: String| async move { Ok(get_unit_from_id(&ctx.client, unit_id).await?) })
        })
        // INFO: LOADOUT
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
