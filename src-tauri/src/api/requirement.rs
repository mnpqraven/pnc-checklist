use super::Ctx;
use crate::requirement::algo_requirement_store_dev;
use rspc::{Router, RouterBuilder};

pub fn requirement_router() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new().query("algos", |t| {
        t(|ctx, _: ()| algo_requirement_store_dev(ctx.client))
    })
}
