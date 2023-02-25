use crate::algorithm::types::AlgoSlot;
use crate::api::AlgoPiece;
use crate::prisma::{algo_piece, slot, PrismaClient};
use prisma_client_rust::QueryError;

pub(super) async fn new_algo_piece(
    client: &PrismaClient,
    data: AlgoPiece,
    loadout_id: Option<String>,
) -> Result<algo_piece::Data, QueryError> {
    let returned = client
        .algo_piece()
        .create(
            data.category.to_string(),
            data.name.to_string(),
            data.stat.to_string(),
            vec![algo_piece::loadout_id::set(loadout_id)],
        )
        .exec()
        .await?;
    new_slots(client, data.slot, &returned.id).await?;
    Ok(returned)
}

async fn new_slots(
    client: &PrismaClient,
    data: AlgoSlot,
    algo_piece_id: &str,
) -> Result<i64, QueryError> {
    client
        .slot()
        .create_many(
            data.0
                .iter()
                .map(|sl| {
                    slot::create_unchecked(
                        sl.placement.to_string(),
                        sl.value,
                        algo_piece_id.to_string(),
                        vec![],
                    )
                })
                .collect(),
        )
        .exec()
        .await
}
