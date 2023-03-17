use super::{error_map, Ctx, crud::algo::new_algo_piece};
use crate::{prisma::algo_piece, algorithm::types::{AlgoCategory, IAlgoPiece}};
use rspc::{Router, RouterBuilder};

pub fn algo_piece_router() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new()
        .mutation("new", |t| {
            t(|ctx, (loadout_id, category, checked_slots): (Option<String>, AlgoCategory, bool)| async move {
                new_algo_piece(&ctx.client, IAlgoPiece::new(category, checked_slots), loadout_id).await.map_err(error_map)
            })
        })
        .mutation("deleteById", |t| {
            t(| ctx, algo_piece_id: String | async move {
                ctx.client.algo_piece().delete(algo_piece::id::equals(algo_piece_id)).exec().await.map_err(error_map)
            })
        })
}

pub fn algo_piece_many_router() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new()
        .query("get", |t| {
            t(|ctx, _: ()| async move {
                ctx.client
                    .algo_piece()
                    .find_many(vec![])
                    .with(algo_piece::loadout::fetch())
                    .exec()
                    .await
                    .map_err(error_map)
            })
        })
        .query("getByLoadoutIds", |t| {
            t(|ctx, loadout_ids: Vec<String>| async move {
                ctx.client
                    .algo_piece()
                    .find_many(vec![algo_piece::loadout_id::in_vec(loadout_ids)])
                    .with(algo_piece::loadout::fetch())
                    .exec()
                    .await
                    .map_err(error_map)
            })
        })
        .mutation("save", |t| {
            t(|ctx, algo_pieces: Vec<algo_piece::Data>| async move {
                ctx.client._batch(algo_pieces.into_iter().map(|data| {
                        ctx.client.algo_piece().update(
                            algo_piece::id::equals(data.id),
                            vec![
                            algo_piece::name::set(data.name),
                            algo_piece::stat::set(data.stat),
                            ],
                        )
                    })).await.map_err(error_map)
            })
        })
}
