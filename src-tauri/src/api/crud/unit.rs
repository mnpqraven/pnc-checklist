use crate::{
    api::crud::algo::new_algo_piece,
    prisma::{self, unit, PrismaClient},
    stats::types::IUnitSkill,
    unit::types::{ILoadout, IUnit},
};
use prisma_client_rust::QueryError;

pub async fn new_unit(client: &PrismaClient, data: IUnit) -> Result<unit::Data, QueryError> {
    let created = client
        .unit()
        .create(data.name, data.class.to_string(), vec![])
        .exec()
        .await?;
    new_loadout(client, data.current, created.id.clone()).await?;
    new_loadout(client, data.goal, created.id.clone()).await?;
    Ok(created)
}

pub async fn get_units(client: &PrismaClient) -> Result<Vec<unit::Data>, QueryError> {
    client.unit().find_many(vec![]).exec().await
}

pub async fn delete_unit(client: &PrismaClient, unit_id: String) -> Result<unit::Data, QueryError> {
    client.unit().delete(unit::id::equals(unit_id)).exec().await
}

pub async fn get_unit_from_id(
    client: &PrismaClient,
    unit_id: String,
) -> Result<unit::Data, QueryError> {
    Ok(client
        .unit()
        .find_unique(unit::id::equals(unit_id))
        .exec()
        .await?
        .unwrap())
}

async fn new_loadout(
    client: &PrismaClient,
    data: ILoadout,
    unit_id: String,
) -> Result<prisma::loadout::Data, QueryError> {
    // let algos = new_algo_pieces(client, data.algo.get_bucket()).await?;
    let created = client
        .loadout()
        .create(
            data.level.0 as i32,
            data.neural.to_string(),
            data.loadout_type.to_string(),
            prisma::unit::id::equals(unit_id),
            vec![],
        )
        .exec()
        .await?;

    futures::future::join_all(
        data.algo
            .get_bucket()
            .into_iter()
            .map(|algo| async { new_algo_piece(client, algo, Some(created.id.clone())).await }),
    )
    .await;

    new_unit_skill(client, data.skill_level, created.id.clone()).await?;
    Ok(created)
}

async fn new_unit_skill(
    client: &PrismaClient,
    data: IUnitSkill,
    loadout_id: String,
) -> Result<prisma::unit_skill::Data, QueryError> {
    client
        .unit_skill()
        .create(
            data.auto as i32,
            data.passive as i32,
            prisma::loadout::id::equals(loadout_id),
            vec![],
        )
        .exec()
        .await
}
