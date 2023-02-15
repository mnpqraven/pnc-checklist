use std::ops::Not;

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use strum::{Display, EnumIter};
use ts_rs::TS;

#[allow(clippy::upper_case_acronyms)]
#[derive(
    Serialize, Deserialize, TS, JsonSchema, Debug, Clone, EnumIter, Display, PartialEq, Eq,
)]
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

#[derive(Serialize, Deserialize, Debug, Clone, TS, PartialEq, Eq, JsonSchema)]
#[ts(export, export_to = "bindings/structs/")]
pub struct AlgoPiece {
    pub name: Algorithm,
    pub stat: AlgoMainStat,
    // sub_stat: Option<Vec<AlgoSubStat>>,
    pub slot: AlgoSlot,
}

#[derive(Serialize, Deserialize, TS, Clone, Debug, PartialEq, Eq, JsonSchema)]
#[ts(export, export_to = "bindings/structs/")]
pub struct Slot {
    pub placement: SlotPlacement,
    pub value: bool,
}

#[derive(
    Serialize, Deserialize, Debug, Clone, TS, EnumIter, Display, PartialEq, Eq, JsonSchema,
)]
#[ts(export, export_to = "bindings/enums/")]
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

#[derive(Serialize, Deserialize, Debug, Clone, TS, PartialEq, Eq, JsonSchema)]
#[ts(export, export_to = "bindings/structs/")]
pub struct AlgoSlot(pub Vec<Slot>);
// pub struct AlgoSlot(pub Vec<bool>);

#[derive(Serialize, Deserialize, Debug, Clone, Default, TS, PartialEq, JsonSchema)]
#[ts(export, export_to = "bindings/structs/")]
pub struct AlgoSet {
    pub offense: Vec<AlgoPiece>,
    pub stability: Vec<AlgoPiece>,
    pub special: Vec<AlgoPiece>,
}

#[allow(clippy::upper_case_acronyms)]
#[derive(
    Serialize, Deserialize, Debug, Clone, TS, EnumIter, Display, PartialEq, Eq, JsonSchema,
)]
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

#[derive(Debug, Display, Serialize, Deserialize, TS, EnumIter)]
#[ts(export, export_to = "bindings/enums/")]
pub enum AlgoSubStat {
    CritRate,
    CritDmg,
    Hashrate,
    HashratePercent,
}

#[derive(Serialize, Deserialize, PartialEq, Eq, Debug, Display, Clone, Copy, TS, EnumIter)]
#[ts(export, export_to = "bindings/enums/")]
pub enum AlgoCategory {
    Offense,
    Stability,
    Special,
}
