use crate::{
    api::crud::algo::new_algo_piece,
    prisma::{self, loadout, unit_skill, PrismaClient},
    stats::types::UnitSkill,
    unit::types::{Loadout, Unit},
};
use prisma_client_rust::QueryError;

pub async fn new_unit(client: &PrismaClient, data: Unit) -> Result<prisma::unit::Data, QueryError> {
    let current_lo_id = new_loadout(client, data.current).await?.id;
    let goal_lo_id = new_loadout(client, data.goal).await?.id;
    let created = client
        .unit()
        .create(
            data.name,
            data.class.to_string(),
            loadout::id::equals(current_lo_id),
            loadout::id::equals(goal_lo_id),
            data.class.to_string(),
            vec![],
        )
        .exec()
        .await?;
    Ok(created)
}

pub async fn new_loadout(
    client: &PrismaClient,
    data: Loadout,
) -> Result<prisma::loadout::Data, QueryError> {
    let skill = new_unit_skill(client, data.skill_level).await?;
    // let algos = new_algo_pieces(client, data.algo.get_bucket()).await?;
    let created = client
        .loadout()
        .create(
            unit_skill::id::equals(skill.id),
            data.level.0 as i32,
            data.neural.to_string(),
            data.loadout_type.to_string(),
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
    Ok(created)
}

pub async fn new_unit_skill(
    client: &PrismaClient,
    data: UnitSkill,
) -> Result<prisma::unit_skill::Data, QueryError> {
    client
        .unit_skill()
        .create(data.auto as i32, data.passive as i32, vec![])
        .exec()
        .await
}
