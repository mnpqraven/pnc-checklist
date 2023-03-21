use std::sync::Arc;
use prisma_client_rust::QueryError;
use crate::prisma::{PrismaClient, self};

pub async fn get_slots(
    client: Arc<PrismaClient>,
    algo_piece_ids: Option<Vec<String>>,
) -> Result<Vec<prisma::slot::Data>, QueryError> {
    let pat = match algo_piece_ids {
        Some(ids) => vec![prisma::slot::algo_piece_id::in_vec(ids)],
        None => vec![],
    };
    client.slot().find_many(pat).exec().await
}
