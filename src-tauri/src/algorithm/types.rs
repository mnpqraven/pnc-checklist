use std::ops::Not;

use rspc::Type;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use strum::{Display, EnumIter};

#[allow(clippy::upper_case_acronyms)]
#[derive(
    Serialize, Deserialize, JsonSchema, Debug, Clone, EnumIter, Display, PartialEq, Eq,
    Type
)]
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
    #[strum(serialize = "Loop Gain")]
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

#[derive(Serialize, Deserialize, Debug, Clone, Type, PartialEq, Eq, JsonSchema)]
pub struct AlgoPiece {
    pub name: Algorithm,
    pub stat: AlgoMainStat,
    pub category: AlgoCategory,
    pub slot: AlgoSlot
}

#[derive(Serialize, Deserialize, Type, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct Slot {
    pub placement: SlotPlacement,
    pub value: bool,
}

#[derive(Serialize, Deserialize, Type, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct AlgoSlot(pub Vec<Slot>);

#[derive(
    Serialize, Deserialize, Debug, Clone, Type, EnumIter, Display, PartialEq, Eq, JsonSchema,
)]
pub enum SlotPlacement {
    One,
    Two,
    Three,
}

impl Not for Slot {
    type Output = Self;

    fn not(self) -> Self::Output {
        Self {
            placement: self.placement,
            value: !self.value,
        }
    }
}

impl Slot {
    pub fn set(&mut self, to: bool) {
        self.value = to
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, Default, Type, PartialEq, JsonSchema)]
pub struct AlgoSet {
    pub offense: Vec<AlgoPiece>,
    pub stability: Vec<AlgoPiece>,
    pub special: Vec<AlgoPiece>,
}

#[allow(clippy::upper_case_acronyms)]
#[derive(
    Serialize, Deserialize, Debug, Clone, Type, EnumIter, Display, PartialEq, Eq, JsonSchema,
)]
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
    #[strum(serialize = "Physical Pen.")]
    PhysPen,
    #[strum(serialize = "Physical Pen. %")]
    PhysPenPercent,
    #[strum(serialize = "Operand Pen.")]
    OperandPen,
    #[strum(serialize = "Operand Pen. %")]
    OperandPenPercent,
    #[strum(serialize = "Crit %")]
    CritRate,
    #[strum(serialize = "Crit Dmg %")]
    CritDmg,
    #[strum(serialize = "Damage Inc.")]
    DamageInc,
    Dodge,
    #[strum(serialize = "Heal Inc.")]
    HealInc,
    Def,
    #[strum(serialize = "Def %")]
    DefPercent,
    #[strum(serialize = "Operand Def")]
    OperandDef,
    #[strum(serialize = "Operand Def %")]
    OperandDefPercent,
    #[strum(serialize = "Post Battle Regen")]
    PostBattleRegen,
}

#[derive(Debug, Display, Serialize, Deserialize, Type, EnumIter)]
pub enum AlgoSubStat {
    CritRate,
    CritDmg,
    Hashrate,
    HashratePercent,
}

#[derive(Serialize, Deserialize, PartialEq, Eq, Debug, Display, Clone, Copy, Type, EnumIter, JsonSchema)]
pub enum AlgoCategory {
    Offense,
    Stability,
    Special,
}
