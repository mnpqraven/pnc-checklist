use crate::{
    model::structs::{AlgoCategory, AlgoMainStat, AlgoPiece, AlgoSet, AlgoTypeDb, Algorithm, Day},
    table::consts::{ALGO_OFFENSE, ALGO_SPECIAL, ALGO_STABILITY},
};

impl Algorithm {
    pub fn all_gen1() -> Vec<Algorithm> {
        vec![
            Algorithm::LowerLimit,
            Algorithm::Feedforward,
            Algorithm::Deduction,
            Algorithm::Progression,
            Algorithm::DataRepair,
            Algorithm::MLRMatrix,
            Algorithm::Encapsulate,
            Algorithm::Iteration,
            Algorithm::Perception,
            Algorithm::Overflow,
            Algorithm::Rationality,
            Algorithm::Convolution,
            Algorithm::Inspiration,
            Algorithm::LoopGain,
            Algorithm::SVM,
            Algorithm::Paradigm,
            Algorithm::DeltaV,
            Algorithm::Cluster,
            Algorithm::Stratagem,
        ]
    }
    pub fn all_gen2() -> Vec<Algorithm> {
        vec![
            Algorithm::Stack,
            Algorithm::LimitValue,
            Algorithm::Reflection,
            Algorithm::Resolve,
            Algorithm::Exploit,
        ]
    }
    pub fn all() -> Vec<Algorithm> {
        Algorithm::all_gen1()
            .into_iter()
            .chain(Algorithm::all_gen2().into_iter())
            .collect()
    }
    pub fn get_bonuses(day: Day) -> Option<Vec<Algorithm>> {
        match day {
            Day::Mon => Some(vec![
                Algorithm::Encapsulate,
                Algorithm::Iteration,
                Algorithm::Perception,
                Algorithm::Inspiration,
                Algorithm::Stack,
            ]),
            Day::Tue => Some(vec![
                Algorithm::LowerLimit,
                Algorithm::Feedforward,
                Algorithm::Overflow,
                Algorithm::Rationality,
                Algorithm::LimitValue,
            ]),
            Day::Wed => Some(vec![
                Algorithm::Progression,
                Algorithm::Connection,
                Algorithm::LoopGain,
                Algorithm::SVM,
                Algorithm::Reflection,
            ]),
            Day::Thu => Some(vec![
                Algorithm::Deduction,
                Algorithm::DeltaV,
                Algorithm::Paradigm,
                Algorithm::Convolution,
                Algorithm::Exploit,
            ]),
            Day::Fri => Some(vec![
                Algorithm::DataRepair,
                Algorithm::MLRMatrix,
                Algorithm::Cluster,
                Algorithm::Stratagem,
                Algorithm::Resolve,
            ]),
            Day::Sat => None,
            Day::Sun => None,
        }
    }
}

impl AlgoSet {
    pub fn new() -> Self {
        Self {
            offense: vec![AlgoPiece::new(AlgoCategory::Offense)],
            stability: vec![AlgoPiece::new(AlgoCategory::Stability)],
            special: vec![AlgoPiece::new(AlgoCategory::Special)],
        }
    }
}

impl AlgoPiece {
    /// creates an empty Algo piece with specified slots
    pub fn new(category: AlgoCategory) -> Self {
        match category {
            AlgoCategory::Offense => Self {
                name: Algorithm::Feedforward,
                stat: AlgoMainStat::AtkPercent,
                slot: vec![false; 3],
            },
            AlgoCategory::Stability => Self {
                name: Algorithm::Encapsulate,
                stat: AlgoMainStat::Health,
                slot: vec![false; 3],
            },
            AlgoCategory::Special => Self {
                name: Algorithm::DeltaV,
                stat: AlgoMainStat::Haste,
                slot: vec![false; 3],
            },
        }
    }
    pub fn compute_slots(name: Algorithm, current_slots: Vec<bool>) -> Vec<bool> {
        let size: usize = match name {
            Algorithm::Perception
            | Algorithm::Deduction
            | Algorithm::Connection
            | Algorithm::Cluster
            | Algorithm::Convolution
            | Algorithm::Feedforward
            | Algorithm::Inspiration
            | Algorithm::Progression
            | Algorithm::Rationality
            | Algorithm::Stratagem => 2,
            _ => 3,
        };
        let mut res: Vec<bool> = Vec::new();
        for i in 0..size {
            res.push(*current_slots.get(i).unwrap_or(&false));
        }
        res
    }
}

impl AlgoTypeDb {
    fn get_algo(category: AlgoCategory) -> Self {
        let algos: Vec<Algorithm> = match category {
            AlgoCategory::Offense => ALGO_OFFENSE.to_vec(),
            AlgoCategory::Stability => ALGO_STABILITY.to_vec(),
            AlgoCategory::Special => ALGO_SPECIAL.to_vec(),
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

