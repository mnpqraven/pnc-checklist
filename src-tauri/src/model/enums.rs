use serde::{Deserialize, Serialize};
use strum::{EnumIter, Display};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq, Default, TS, EnumIter)]
#[ts(export, export_to = "bindings/enums/")]
pub enum Class {
    #[default]
    Guard,
    Medic,
    Sniper,
    Specialist,
    Warrior,
}

#[allow(clippy::upper_case_acronyms)]
#[derive(Serialize, Deserialize, Debug, Clone, TS, EnumIter, Display)]
#[ts(export, export_to = "bindings/enums/")]
/// List of algorithms
pub enum Algorithm {
    //offense
    #[strum(serialize = "Lower Limit")]
    LowerLimit,
    Feedforward,
    Deduction,
    Progression,
    #[strum(serialize = "Data Repair")]
    DataRepair,
    #[strum(serialize = "MLR Matrix")]
    MLRMatrix,
    Stack,
    #[strum(serialize = "Limit Value")]
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
    #[strum(serialize = "S.V.M")]
    SVM,
    Paradigm,
    #[strum(serialize = "Delta V")]
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
#[derive(Serialize, Deserialize, Debug, Clone, TS, EnumIter, Display)]
#[ts(export, export_to = "bindings/enums/")]
pub enum AlgoMainStat {
    Hashrate,
    #[strum(serialize = "Hashrate %")]
    HashratePercent,
    Atk,
    #[strum(serialize = "Atk %")]
    AtkPercent,
    Health,
    #[strum(serialize = "Health %")]
    HealthPercent,
    Haste,
    #[strum(serialize = "Crit %")]
    CritRate,
    #[strum(serialize = "Crit Dmg %")]
    CritDmg,
    #[strum(serialize = "Damage Inc.")]
    DamageInc,
    Dodge,
    #[strum(serialize = "Heal Inc.")]
    HealInc,
    #[strum(serialize = "Damage Mit.")]
    DamageReduction,
    Def,
    #[strum(serialize = "Def %")]
    DefPercent,
    #[strum(serialize = "Operand Def")]
    OperandDef,
    #[strum(serialize = "Operand Def %")]
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
