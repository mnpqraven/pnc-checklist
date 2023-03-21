use crate::{
    algorithm::types::{AlgoCategory, AlgoMainStat, Algorithm, SlotPlacement},
    loadout::types::LoadoutType,
    unit::types::{Class, NeuralExpansion}, table::types::Day,
};
use std::{
    fmt::{Debug, Display},
    str::FromStr,
};
use rspc::Type;
use serde::{Serialize, Deserialize};
use strum::IntoEnumIterator;

pub trait FromAsync<T>: Sized {
    async fn from_async(value: T) -> Self;
}

#[derive(Serialize, Deserialize, Type, Debug)]
pub struct CodeTuple<T> {
    pub code: String,
    pub label: T
}

pub trait Code: Debug + Display + FromStr + IntoEnumIterator + Clone {
    fn raw_code(&self) -> String {
        format!("{:?}", self)
    }

    fn pretty(&self) -> String {
        self.to_string()
    }

    fn list_enum_tuple() -> Vec<CodeTuple<Self>> {
        Self::iter().map(|e| CodeTuple {
            code: format!("{:?}", e),
            label: e
        }).collect::<Vec<CodeTuple<Self>>>()
    }
}

impl Code for Class {}
impl Code for Day {}
impl Code for Algorithm {}
impl Code for AlgoMainStat {}
// impl Code for AlgoSubStat {}
impl Code for AlgoCategory {}
impl Code for NeuralExpansion {}
impl Code for LoadoutType {}
impl Code for SlotPlacement {}
