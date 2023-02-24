use crate::{
    algorithm::types::{AlgoPiece, AlgoSlot},
    prisma::{
        algo_piece, en_algo_category, en_algo_main_stat, en_algorithm, slot, unit, PrismaClient,
    },
    unit::types::Unit,
};
use prisma_client_rust::QueryError;

// TODO: test
pub(super) async fn new_algo_piece(
    client: &PrismaClient,
    data: AlgoPiece,
) -> Result<algo_piece::Data, QueryError> {
    let returned = client
        .algo_piece()
        .create(
            en_algorithm::name::equals(data.name.to_string()),
            en_algo_category::name::equals(data.get_category().to_string()), // TODO:
            en_algo_main_stat::name::equals(data.stat.to_string()),
            vec![],
        )
        .exec()
        .await?;
    let piece_id = returned.id.clone();
    new_slots(client, data.slot, &piece_id).await?;
    Ok(returned)
}

pub(super) async fn new_slots(
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
                        sl.value,
                        algo_piece_id.to_string(),
                        sl.placement.to_string(),
                        vec![],
                    )
                })
                .collect(),
        )
        .exec()
        .await
}
