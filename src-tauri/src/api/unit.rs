use super::{
    crud::unit::{delete_unit, get_unit_from_id, get_units},
    error_map, Ctx,
};
use crate::{
    api::crud::unit::new_unit,
    prisma::unit,
    requirement::types::UnitRequirement,
    traits::FromAsync,
    unit::types::{Class, IUnit},
};
use rspc::{Router, RouterBuilder};

pub fn unit_router() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new()
        .query("getById", |t| {
            t(|ctx, unit_id: String| async move {
                get_unit_from_id(&ctx.client, unit_id)
                    .await
                    .map_err(error_map)
            })
        })
        .mutation("new", |t| {
            t(|ctx, (name, class): (String, Class)| async move {
                let unit = IUnit::new(name, class);
                let new_unit = new_unit(&ctx.client, unit).await.map_err(error_map);
                let t = IUnit::from_async(new_unit.clone().unwrap()).await;
                println!("{:?}", t);
                new_unit
            })
        })
        .mutation("delete", |t| {
            t(|ctx, unit_id: String| async move {
                delete_unit(&ctx.client, unit_id).await.map_err(error_map)
            })
        })
}

pub fn unit_many_router() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new()
        .query("get", |t| {
            t(|ctx, _: ()| async move { get_units(&ctx.client).await.map_err(error_map) })
        })
        .mutation("save", |t| {
            t(|ctx, units: Vec<crate::prisma::unit::Data>| async move {
                futures::future::try_join_all(
                    units
                        .iter()
                        .map(|data| async move { UnitRequirement::calculate(data).await }),
                )
                .await?;
                ctx.client
                    ._batch(units.into_iter().map(|data| {
                        ctx.client.unit().update(
                            unit::id::equals(data.id),
                            vec![unit::name::set(data.name), unit::class::set(data.class)],
                        )
                    }))
                    .await
                    .map_err(error_map)
            })
        })
}
