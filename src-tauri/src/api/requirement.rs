use super::Ctx;
use crate::requirement::requirement_algo_store_dev;
use rspc::{Router, RouterBuilder};

pub fn requirement_router() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new().query("algos", |t| {
        t(|ctx, _: ()| requirement_algo_store_dev(ctx.client))
    })
}
