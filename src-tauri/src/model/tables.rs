use super::structs::{AlgoCategory, Algorithm, Bonus, Class, Day};
use crate::parser::parse::AlgoTypeDb;
use serde::Serialize;

/// cost of skill level token
/// follow user-displayed slv so the 1st index will be 0 (slv always starts at 1)
pub const REQ_SLV_TOKEN: [u32; 10] = [0, 100, 200, 360, 560, 880, 1320, 1920, 2680, 3600];
pub const REQ_SLV_PIVOT: [u32; 10] = [0, 0, 0, 0, 0, 0, 0, 4, 8, 12];
pub const REQ_SLV_COIN: [u32; 10] = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 10000];

pub const REQ_NEURAL: [u32; 9] = [0, 5, 10, 25, 40, 60, 70, 90, 100];
pub const REQ_NEURAL_COIN: [u32; 9] = [0, 1000, 2000, 3000, 4000, 5000, 7500, 10000, 20000];

pub const REQ_EXP_LB0: [u32; 10] = [0, 90, 140, 190, 240, 290, 340, 390, 440, 490];
pub const REQ_EXP_LB1: [u32; 10] = [540, 580, 620, 660, 700, 740, 780, 820, 860, 900];
pub const REQ_EXP_LB2: [u32; 10] = [940, 980, 1000, 1050, 1100, 1300, 1410, 1540, 1930, 2190];
pub const REQ_EXP_LB3: [u32; 10] = [2450, 2450, 2580, 2830, 2960, 3090, 3220, 3480, 3610, 3740];
pub const REQ_EXP_LB4: [u32; 10] = [3990, 4250, 4510, 4770, 4900, 5800, 6190, 6320, 6700, 6960];
pub const REQ_EXP_LB5: [u32; 10] = [
    7090, 7700, 8500, 9100, 10400, 11000, 11800, 12500, 13400, 14000,
];
pub const REQ_EXP_LB6: [u32; 10] = [
    17000, 22000, 29000, 38000, 49000, 61000, 74000, 88000, 103000, 119000,
];
pub const REQ_EXP_CHAIN: [&[u32; 10]; 7] = [
    &REQ_EXP_LB0,
    &REQ_EXP_LB1,
    &REQ_EXP_LB2,
    &REQ_EXP_LB3,
    &REQ_EXP_LB4,
    &REQ_EXP_LB5,
    &REQ_EXP_LB6,
];

/// first 6 items are widget count, last item is coin requirement
/// gray green blue purple gold rainbow
pub const REQ_BREAK_LB0: [u32; 7] = [0; 7];
pub const REQ_BREAK_LB1: [u32; 7] = [10, 0, 0, 0, 0, 0, 500];
pub const REQ_BREAK_LB2: [u32; 7] = [10, 15, 0, 0, 0, 0, 2000];
pub const REQ_BREAK_LB3: [u32; 7] = [0, 15, 20, 0, 0, 0, 5000];
pub const REQ_BREAK_LB4: [u32; 7] = [0, 0, 15, 25, 0, 0, 10000];
pub const REQ_BREAK_LB5: [u32; 7] = [0, 0, 0, 20, 30, 0, 20000];
pub const REQ_BREAK_LB6: [u32; 7] = [0, 0, 0, 0, 25, 35, 120000];
#[allow(dead_code)]
pub const REQ_BREAK_CHAIN: [&[u32; 7]; 7] = [
    &REQ_BREAK_LB0,
    &REQ_BREAK_LB1,
    &REQ_BREAK_LB2,
    &REQ_BREAK_LB3,
    &REQ_BREAK_LB4,
    &REQ_BREAK_LB5,
    &REQ_BREAK_LB6,
];

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
    Algorithm::Connection,
    Algorithm::Reflection,
    Algorithm::Resolve,
];
const ALGO_SPECIAL: [Algorithm; 9] = [
    Algorithm::Inspiration,
    Algorithm::LoopGain,
    Algorithm::SVM,
    Algorithm::Paradigm,
    Algorithm::DeltaV,
    Algorithm::Convolution,
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
