use super::Ctx;
use crate::{algorithm::types::{Algorithm, AlgoMainStat}, loadout::types::LoadoutType, traits::Code};
use rspc::{Router, RouterBuilder};

pub fn enum_router() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new()
        .query("LoadoutType", |t| {
            t(|_, _: ()| async move {
                LoadoutType::list_enum_tuple()
            })
        })
        .query("Algorithm", |t| {
            t(|_, _: ()| async move {
                 Algorithm::list_enum_tuple()
            })
        })
        .query("AlgoMainStat", |t| {
            t(|_, _: ()| async move {
                 AlgoMainStat::list_enum_tuple()
            })
        })
}
