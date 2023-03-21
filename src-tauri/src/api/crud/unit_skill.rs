use std::sync::Arc;
use prisma_client_rust::QueryError;
use crate::prisma::{PrismaClient, self};

pub async fn get_unit_skills(
    client: Arc<PrismaClient>,
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

