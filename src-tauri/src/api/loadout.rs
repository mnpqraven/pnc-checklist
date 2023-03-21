use super::{error_map, Ctx};
use crate::{loadout::get_loadout_tuple, prisma::loadout};
use rspc::{Router, RouterBuilder};

pub fn loadout_many_router() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new()
        .query("get", |t| {
            t(|ctx, _: ()| async move {
                ctx.client
                    .loadout()
                    .find_many(vec![])
                    .exec()
                    .await
                    .map_err(error_map)
            })
        })
        .query("getById", |t| {
            t(|ctx, loadout_id: String| async move {
                ctx.client
                    .loadout()
                    .find_many(vec![loadout::id::equals(loadout_id)])
                    .exec()
                    .await
                    .map_err(error_map)
            })
        })
        .query("getTupleByUnitId", |t| {
            t(|_, unit_id: String| async move {
                get_loadout_tuple(unit_id).await.map_err(error_map)
            })
        })
        .mutation("save", |t| {
            t(|ctx, loadouts: Vec<loadout::Data>| async move {
                ctx.client
                    ._batch(loadouts.into_iter().map(|data| {
                        ctx.client.loadout().update(
                            loadout::id::equals(data.id),
                            vec![
                                loadout::level::set(data.level),
                                loadout::neural::set(data.neural),
                                loadout::frags::set(data.frags),
                            ],
                        )
                    }))
                    .await
                    .map_err(error_map)
            })
        })
}

pub fn loadout_router() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new().query("getByUnitId", |t| {
        t(|ctx, unit_id: Option<String>| async move {
            let pat = match unit_id {
                Some(id) => vec![loadout::unit_id::equals(id)],
                None => vec![],
            };
            ctx.client
                .loadout()
                .find_many(pat)
                .exec()
                .await
                .map_err(error_map)
        })
    })
}
