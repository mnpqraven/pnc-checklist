use crate::{algorithm::types::Algorithm, unit::types::Class};
use rspc::Type;
use serde::{Deserialize, Serialize};
use strum::{EnumIter, Display, EnumString};

#[derive(Serialize, Deserialize, Debug, Display, Clone, Copy, Type, EnumIter, EnumString)]
pub enum Day {
    Mon,
    Tue,
    Wed,
    Thu,
    Fri,
    Sat,
    Sun,
}

#[derive(Serialize, Type)]
pub struct ResourceByDay {
    pub day: Day,
    pub coin: Option<Bonus>,
    pub exp: Option<Bonus>,
    pub skill: Option<Bonus>,
    pub class: Option<Bonus>,
    pub algos: Vec<Algorithm>,
}

#[derive(Serialize, Deserialize, Debug, Display, Clone, Copy, Type, EnumIter)]
pub enum Bonus {
    Coin,
    Exp,
    Skill,
    Class(Class),
}
