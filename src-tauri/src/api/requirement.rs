use crate::{
    algorithm::types::IAlgoPiece, requirement::types::AlgorithmRequirement,
    service::errors::RequirementError, traits::FromAsync, unit::types::IUnit,
};

use super::Ctx;
use rspc::{Router, RouterBuilder};

pub fn requirement_router() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new()
    .query("algos", |t| {
        t(|ctx, _: ()| async move {
            let units = ctx.client.unit().find_many(vec![]).exec().await.unwrap();
            let future_iter = units.into_iter().map(|db_unit| async {
                let from_unit = IUnit::from_async(db_unit).await;
                Ok::<AlgorithmRequirement, RequirementError<IAlgoPiece>>(
                    AlgorithmRequirement::calculate(&from_unit)?,
                )
            });
            futures::future::try_join_all(future_iter)
                .await
                .map_err(rspc::Error::from)
        })
    })
}
