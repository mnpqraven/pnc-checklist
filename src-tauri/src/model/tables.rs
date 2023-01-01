use super::infomodel::{AlgoCategory, Algorithm, Bonus, Class, Day};
use crate::parser::parse::AlgoTypeDb;
use serde::Serialize;

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
    Algorithm::Exploit,
];

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
impl Algorithm {
    fn get_bonuses(day: Day) -> Option<Vec<Algorithm>> {
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
#[tauri::command]
pub fn generate_algo_db() -> Vec<AlgoTypeDb> {
    AlgoTypeDb::generate_algo_db()
}
#[tauri::command]
pub fn get_algo_by_days(day: Day) -> Option<Vec<Algorithm>> {
    Algorithm::get_bonuses(day)
}

// [ [coin, exp, skill, class]; ...days ]
#[allow(dead_code)]
const BONUS_TABLE: [[Option<Bonus>; 4]; 7] = [
    [
        Some(Bonus::Coin),
        None,
        None,
        Some(Bonus::Class(Class::Guard)),
    ],
    [
        None,
        None,
        Some(Bonus::Skill),
        Some(Bonus::Class(Class::Sniper)),
    ],
    [
        None,
        Some(Bonus::Exp),
        None,
        Some(Bonus::Class(Class::Warrior)),
    ],
    [
        Some(Bonus::Coin),
        None,
        None,
        Some(Bonus::Class(Class::Specialist)),
    ],
    [
        None,
        None,
        Some(Bonus::Skill),
        Some(Bonus::Class(Class::Medic)),
    ],
    [None, Some(Bonus::Exp), None, None],
    [
        Some(Bonus::Coin),
        Some(Bonus::Exp),
        Some(Bonus::Skill),
        None,
    ],
];
#[derive(Serialize)]
pub struct ResourceByDay {
    day: Day,
    coin: &'static Option<Bonus>,
    exp: &'static Option<Bonus>,
    skill: &'static Option<Bonus>,
    class: &'static Option<Bonus>,
    algos: Option<Vec<Algorithm>>,
}
impl ResourceByDay {
    pub fn get_bonuses(day: Day) -> Self {
        unsafe {
            Self {
                day,
                coin: &BONUS_TABLE.get_unchecked(day as usize)[0],
                exp: &BONUS_TABLE.get_unchecked(day as usize)[1],
                skill: &BONUS_TABLE.get_unchecked(day as usize)[2],
                class: &BONUS_TABLE.get_unchecked(day as usize)[3],
                algos: Algorithm::get_bonuses(day),
            }
        }
    }
}
#[tauri::command]
pub fn get_bonuses(day: Day) -> ResourceByDay {
    ResourceByDay::get_bonuses(day)
}
