use self::preload::*;
use crate::service::db::get_db;
use prisma_client_rust::QueryError;

mod preload;

pub async fn db_preload_enums() -> Result<(), QueryError> {
    let client = get_db().await;
    preload_algorithm(&client).await?;
    preload_algo_main_stat(&client).await?;
    preload_slot_placement(&client).await?;
    preload_class(&client).await?;
    preload_neural_expansion(&client).await?;
    preload_algo_category(&client).await?;
    Ok(())
}
