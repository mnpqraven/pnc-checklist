use crate::prisma::slot;

use super::{error_map, get_slots, Ctx};
use rspc::{Router, RouterBuilder};

pub fn slot_router() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new()
}
pub fn slot_many_router() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new()
        .query("get", |t| {
            t(|ctx, _: ()| async move {
                ctx.client
                    .slot()
                    .find_many(vec![])
                    .exec()
                    .await
                    .map_err(error_map)
            })
        })
        .query("getByAlgoPieceIds", |t| {
            t(|ctx, algo_piece_ids: Option<Vec<String>>| async move {
                get_slots(&ctx.client, algo_piece_ids)
                    .await
                    .map_err(error_map)
            })
        })
        .mutation("save", |t| {
            t(|ctx, slots: Vec<slot::Data>| async move {
                ctx.client
                    ._batch(slots.into_iter().map(|data| {
                        ctx.client.slot().update(
                            slot::id::equals(data.id),
                            vec![
                                slot::placement::set(data.placement),
                                slot::value::set(data.value),
                            ],
                        )
                    }))
                    .await
                    .map_err(error_map)
            })
        })
}
