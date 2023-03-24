use super::Ctx;
use crate::{
    algorithm::types::{AlgoMainStat, Algorithm},
    loadout::types::LoadoutType,
    table::types::{Day, Bonus},
    traits::Code,
    unit::types::{Class, NeuralExpansion},
};
use rspc::{Router, RouterBuilder};

pub fn enum_router() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new()
        .query("LoadoutType", |t| {
            t(|_, _: ()| LoadoutType::list_enum_tuple())
        })
        .query("Algorithm", |t| t(|_, _: ()| Algorithm::list_enum_tuple()))
        .query("AlgoMainStat", |t| {
            t(|_, _: ()| AlgoMainStat::list_enum_tuple())
        })
        .query("Class", |t| t(|_, _: ()| Class::list_enum_tuple()))
        .query("Day", |t| t(|_, _: ()| Day::list_enum_tuple()))
        .query("Bonus", |t| t(|_, _: ()| Bonus::list_enum_tuple()))
        .query("NeuralExpansion", |t| t(|_, _: ()| NeuralExpansion::list_enum_tuple()))
}
