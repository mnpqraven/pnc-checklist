use crate::parser::parse::AlgoTypeDb;

use super::infomodel::{AlgoCategory, Algorithm};

/// cost of skill level token
/// follow user-displayed slv so the 1st index will be 0 (slv always starts at 1)
pub const SLV_TOKEN: [u32; 10] = [0, 100, 200, 360, 560, 880, 1320, 1920, 2680, 3600];
pub const SLV_PIVOT: [u32; 10] = [0, 0, 0, 0, 0, 0, 0, 4, 8, 12];
pub const SLV_COIN: [u32; 10] = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 10000];

const ALGO_OFFENSE: [Algorithm; 8] = [
    Algorithm::LowerLimit,
    Algorithm::Feedforward,
    Algorithm::Deduction,
    Algorithm::Progression,
    Algorithm::DataRepair,
    Algorithm::MLRMatrix,
    Algorithm::Stack,
    Algorithm::LimitValue,
];
const ALGO_STABILITY: [Algorithm; 8] = [
    Algorithm::Encapsulate,
    Algorithm::Iteration,
    Algorithm::Perception,
    Algorithm::Overflow,
    Algorithm::Rationality,
    Algorithm::Convolution,
    Algorithm::Reflection,
    Algorithm::Resolve,
];
const ALGO_SPECIAL: [Algorithm; 8] = [
    Algorithm::Inspiration,
    Algorithm::LoopGain,
    Algorithm::SVM,
    Algorithm::Paradigm,
    Algorithm::DeltaV,
    Algorithm::Cluster,
    Algorithm::Stratagem,
    Algorithm::Exploit
];

impl AlgoTypeDb {
    fn get_algo(category: AlgoCategory) -> Self {
        let algos: Vec<Algorithm> = match category {
            AlgoCategory::Offense => ALGO_OFFENSE.to_vec(),
            AlgoCategory::Stability => ALGO_STABILITY.to_vec(),
            AlgoCategory::Special => ALGO_SPECIAL.to_vec()
        };
        Self { category, algos }
    }

    pub fn generate_algo_db() -> Vec<AlgoTypeDb> {
        vec![
            AlgoTypeDb::get_algo(AlgoCategory::Offense),
            AlgoTypeDb::get_algo(AlgoCategory::Stability),
            AlgoTypeDb::get_algo(AlgoCategory::Special),
        ]
    }
}
