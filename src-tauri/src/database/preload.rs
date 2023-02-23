use crate::{
    algorithm::types::{AlgoMainStat, Algorithm, SlotPlacement, AlgoCategory},
    prisma::*, unit::types::{NeuralExpansion, Class},
};
use prisma_client_rust::QueryError;
use strum::IntoEnumIterator;

pub(super) async fn preload_algorithm(client: &PrismaClient) -> Result<(), QueryError> {
    for enu in Algorithm::iter() {
        client
            .en_algorithm()
            .upsert(
                en_algorithm::name::equals(format!("{:?}", enu)),
                en_algorithm::create(format!("{:?}", enu), enu.to_string(), vec![]),
                vec![],
            )
            .exec()
            .await?;
    }
    Ok(())
}

pub(super) async fn preload_algo_main_stat(client: &PrismaClient) -> Result<(), QueryError> {
    for enu in AlgoMainStat::iter() {
        client
            .en_algo_main_stat()
            .upsert(
                en_algo_main_stat::name::equals(format!("{:?}", enu)),
                en_algo_main_stat::create(format!("{:?}", enu), enu.to_string(), vec![]),
                vec![],
            )
            .exec()
            .await?;
    }
    Ok(())
}

pub(super) async fn preload_slot_placement(client: &PrismaClient) -> Result<(), QueryError> {
    for enu in SlotPlacement::iter() {
        client
            .en_slot_placement()
            .upsert(
                en_slot_placement::name::equals(format!("{:?}", enu)),
                en_slot_placement::create(format!("{:?}", enu), vec![]),
                vec![],
            )
            .exec()
            .await?;
    }
    Ok(())
}

pub(super) async fn preload_class(client: &PrismaClient) -> Result<(), QueryError> {
    for enu in Class::iter() {
        client
            .en_class()
            .upsert(
                en_class::name::equals(format!("{:?}", enu)),
                en_class::create(format!("{:?}", enu), vec![]),
                vec![],
            )
            .exec()
            .await?;
    }
    Ok(())
}

pub(super) async fn preload_neural_expansion(client: &PrismaClient) -> Result<(), QueryError> {
    for enu in NeuralExpansion::iter() {
        client
            .en_neural_expansion()
            .upsert(
                en_neural_expansion::name::equals(format!("{:?}", enu)),
                en_neural_expansion::create(format!("{:?}", enu), vec![]),
                vec![],
            )
            .exec()
            .await?;
    }
    Ok(())
}

pub(super) async fn preload_algo_category(client: &PrismaClient) -> Result<(), QueryError> {
    for enu in AlgoCategory::iter() {
        client
            .en_algo_category()
            .upsert(
                en_algo_category::name::equals(format!("{:?}", enu)),
                en_algo_category::create(format!("{:?}", enu), vec![]),
                vec![],
            )
            .exec()
            .await?;
    }
    Ok(())
}
