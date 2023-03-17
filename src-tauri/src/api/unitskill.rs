use super::{error_map, get_skill_levels, Ctx};
use crate::prisma::unit_skill;
use rspc::{Router, RouterBuilder};

pub fn unit_skill_router() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new()
}
pub fn unit_skill_many_router() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new()
        .query("get", |t| {
            t(|ctx, _: ()| async move {
                ctx.client
                    .unit_skill()
                    .find_many(vec![])
                    .exec()
                    .await
                    .map_err(error_map)
            })
        })
        .query("getByUnitIds", |t| {
            t(|ctx, unit_ids: Vec<String>| async move {
                get_skill_levels(&ctx.client, unit_ids)
                    .await
                    .map_err(error_map)
            })
        })
        .mutation("save", |t| {
            t(|ctx, unit_skills: Vec<unit_skill::Data>| async move {
                ctx.client
                    ._batch(unit_skills.into_iter().map(|data| {
                        ctx.client.unit_skill().update(
                            unit_skill::id::equals(data.id),
                            vec![
                                unit_skill::passive::set(data.passive),
                                unit_skill::auto::set(data.auto),
                            ],
                        )
                    }))
                    .await
                    .map_err(error_map)
            })
        })
}
