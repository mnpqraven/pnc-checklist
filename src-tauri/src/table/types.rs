use crate::{algorithm::types::Algorithm, unit::types::Class};
use serde::{Deserialize, Serialize};
use strum::EnumIter;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Clone, Copy, TS, EnumIter)]
#[ts(export, export_to = "bindings/enums/")]
pub enum Day {
    Mon,
    Tue,
    Wed,
    Thu,
    Fri,
    Sat,
    Sun,
}

#[derive(Serialize, ts_rs::TS)]
#[ts(export, export_to = "bindings/structs/")]
pub struct ResourceByDay {
    pub day: Day,
    pub coin: Option<Bonus>,
    pub exp: Option<Bonus>,
    pub skill: Option<Bonus>,
    pub class: Option<Bonus>,
    pub algos: Vec<Algorithm>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy, TS, EnumIter)]
#[ts(export, export_to = "bindings/enums/")]
pub enum Bonus {
    Coin,
    Exp,
    Skill,
    Class(Class),
}
