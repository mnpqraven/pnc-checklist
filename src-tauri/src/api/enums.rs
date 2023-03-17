use super::Ctx;
use crate::{algorithm::types::Algorithm, loadout::types::LoadoutType};
use rspc::{Router, RouterBuilder};
use std::str::FromStr;
use strum::IntoEnumIterator;

pub fn enum_rust_router() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new()
        .query("LoadoutType", |t| {
            t(|_, _: ()| async move {
                LoadoutType::iter()
                    .map(|e| format!("{}", e))
                    .collect::<Vec<String>>()
            })
        })
        .query("Algorithm", |t| {
            t(|_, _: ()| async move {
                Algorithm::iter()
                    .map(|e| format!("{}", e))
                    .collect::<Vec<String>>()
            })
        })
}

pub fn enum_pretty_router() -> RouterBuilder<Ctx> {
    Router::<Ctx>::new()
        .query("LoadoutType", |t| {
            t(|_, _: ()| async move { LoadoutType::iter().collect::<Vec<LoadoutType>>() })
        })
        .query("LoadoutType.raw", |t| {
            t(|_, pretty_string: String| async move {
                format!("{:?}", LoadoutType::from_str(&pretty_string))
            })
        })
        .query("Algorithm", |t| {
            t(|_, _: ()| async move { Algorithm::iter().collect::<Vec<Algorithm>>() })
        })
        // TODO: better with invoke and macros
        .query("Algorithm.toRaw", |t| {
            t(|_, pretty_string: String| async move {
                format!("{:?}", Algorithm::from_str(&pretty_string).unwrap())
            })
        })
}
