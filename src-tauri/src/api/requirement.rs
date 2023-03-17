use crate::{
    algorithm::types::AlgoPiece, requirement::types::AlgorithmRequirement,
    service::errors::RequirementError, traits::FromAsync, unit::types::Unit,
};

use super::Ctx;
use rspc::{Router, RouterBuilder};

pub fn requirement_router() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new().query("algos", |t| {
        t(|ctx, _: ()| async move {
            let units = ctx.client.unit().find_many(vec![]).exec().await.unwrap();
            let future_iter = units.into_iter().map(|db_unit| async {
                let unit = Unit::from_async(db_unit).await;
                // WARN: prone to crashing unwrap here
                Ok::<AlgorithmRequirement, RequirementError<AlgoPiece>>(
                    AlgorithmRequirement::calculate(&unit)?,
                )
            });
            let t = futures::future::join_all(future_iter).await;
            t
        })
    })
}
