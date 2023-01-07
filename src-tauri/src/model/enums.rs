use serde::{Deserialize, Serialize};
use strum::EnumIter;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq, Default, TS, EnumIter)]
#[ts(export, export_to = "bindings/enums/")]
pub enum Class {
    #[default]
    Guard,
    Warrior,
    Sniper,
    Specialist,
    Medic,
}

#[allow(clippy::upper_case_acronyms)]
#[derive(Serialize, Deserialize, Debug, Clone, TS, EnumIter)]
#[ts(export, export_to = "bindings/enums/")]
/// List of algorithms
pub enum Algorithm {
    //offense
    LowerLimit,
    Feedforward,
    Deduction,
    Progression,
    DataRepair,
    MLRMatrix,
    Stack,
    LimitValue,
    //stability
    Encapsulate,
    Iteration,
    Perception,
    Overflow,
    Rationality,
    Connection,
    Convolution,
    Reflection,
    Resolve,
    //special
    Inspiration,
    LoopGain,
    SVM,
    Paradigm,
    DeltaV,
    Cluster,
    Stratagem,
    Exploit,
}

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
#[derive(Serialize, Deserialize, Debug, Clone, Copy, TS, EnumIter)]
#[ts(export, export_to = "bindings/enums/")]
pub enum Bonus {
    Coin,
    Exp,
    Skill,
    Class(Class),
}

#[allow(clippy::upper_case_acronyms)]
#[derive(Serialize, Deserialize, Debug, Clone, TS, EnumIter)]
#[ts(export, export_to = "bindings/enums/")]
pub enum AlgoMainStat {
    Hashrate,
    HashratePercent,
    Atk,
    AtkPercent,
    Health,
    HealthPercent,
    Haste,
    CritRate,
    CritDmg,
    DamageInc,
    Dodge,
    HealInc,
    DamageReduction,
    Def,
    DefPercent,
    OperandDef,
    OperandDefPercent,
}
#[derive(Debug, Serialize, Deserialize, TS, EnumIter)]
#[ts(export, export_to = "bindings/enums/")]
pub enum AlgoSubStat {
    CritRate,
    CritDmg,
    Hashrate,
    HashratePercent,
}

#[derive(Serialize, Deserialize, PartialEq, Eq, Debug, Clone, Copy, TS, EnumIter)]
#[ts(export, export_to = "bindings/enums/")]
pub enum AlgoCategory {
    Offense,
    Stability,
    Special,
}

#[derive(Debug, Serialize, Deserialize, Copy, Clone, TS, EnumIter)]
#[ts(export, export_to = "bindings/enums/")]
pub enum NeuralExpansion {
    One,
    OneHalf,
    Two,
    TwoHalf,
    Three,
    ThreeHalf,
    Four,
    FourHalf,
    Five,
}

#[derive(Debug, Serialize, Deserialize, Copy, Clone, TS, EnumIter)]
#[ts(export, export_to = "bindings/enums/")]
#[ts(rename_all = "lowercase")]
pub enum LoadoutType {
    Current,
    Goal
}