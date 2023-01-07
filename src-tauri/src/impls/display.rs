use crate::model::enums::{AlgoMainStat, Algorithm};
use std::fmt::Display;

impl Display for Algorithm {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let label = match self {
            Algorithm::LowerLimit => "Lower Limit",
            Algorithm::Feedforward => "Feedforward",
            Algorithm::Deduction => "Deduction",
            Algorithm::Progression => "Progression",
            Algorithm::DataRepair => "Data Repair",
            Algorithm::MLRMatrix => "MLR Matrix",
            Algorithm::Encapsulate => "Encapsulate",
            Algorithm::Iteration => "Iteration",
            Algorithm::Perception => "Perception",
            Algorithm::Overflow => "Overflow",
            Algorithm::Rationality => "Rationality",
            Algorithm::Connection => "Connection",
            Algorithm::Convolution => "Convolution",
            Algorithm::Inspiration => "Inspiration",
            Algorithm::LoopGain => "Loop Gain",
            Algorithm::SVM => "S.V.M",
            Algorithm::Paradigm => "Paradigm",
            Algorithm::DeltaV => "Delta V",
            Algorithm::Cluster => "Cluster",
            Algorithm::Stratagem => "Stratagem",
            // gen 2
            Algorithm::Stack => "Stack",
            Algorithm::LimitValue => "Limit Value",
            Algorithm::Reflection => "Reflection",
            Algorithm::Resolve => "Resolve",
            Algorithm::Exploit => "Exploit",
        };
        write!(f, "{label}")
    }
}
impl Display for AlgoMainStat {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let label = match self {
            AlgoMainStat::Hashrate => "Hashrate",
            AlgoMainStat::HashratePercent => "Hashrate %",
            AlgoMainStat::Atk => "Attack",
            AlgoMainStat::AtkPercent => "Atk %",
            AlgoMainStat::Health => "Health",
            AlgoMainStat::HealthPercent => "Health %",
            AlgoMainStat::Haste => "Haste",
            AlgoMainStat::CritRate => "Critical Rate",
            AlgoMainStat::CritDmg => "Critical Damage",
            AlgoMainStat::DamageInc => "Damage Increase",
            AlgoMainStat::Dodge => "Dodge",
            AlgoMainStat::HealInc => "Heal Increase",
            AlgoMainStat::DamageReduction => "Damage Reduction",
            AlgoMainStat::Def => "Defense",
            AlgoMainStat::DefPercent => "Defense %",
            AlgoMainStat::OperandDef => "Openrand Defense",
            AlgoMainStat::OperandDefPercent => "Operand Defense %",
        };
        write!(f, "{label}")
    }
}
