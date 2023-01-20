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

    /// returns all AlgoPieces from the set as a vector
    /// can be used for later searches and filters
    pub fn get_bucket(&self) -> Vec<AlgoPiece> {
        let mut v: Vec<AlgoPiece> = Vec::new();
        let cats = vec![&self.offense, &self.stability, &self.special];
        for cat in cats {
            for piece in cat {
                v.push(piece.clone());
            }
        }
        v
    }

    /// consumes a bucket of AlgoPiece to update the AlgoSet
    fn get_set(bucket: &Vec<AlgoPiece>) -> Self {
        dbg!(&bucket);
        Self {
            offense: bucket
                .iter()
                .map(|e| e.clone())
                .filter(|piece| piece.get_category() == AlgoCategory::Offense)
                .collect(),
            stability: bucket
                .iter()
                .map(|e| e.clone())
                .filter(|piece| piece.get_category() == AlgoCategory::Stability)
                .collect(),
            special: bucket
                .iter()
                .map(|e| e.clone())
                .filter(|piece| piece.get_category() == AlgoCategory::Special)
                .collect(),
        }
    }

    /// given an AlgoSet, toggles the slot vec to update what's still
    /// needed
    ///
    /// * `current`: Algoset that self is getting its slot vector compared with
    // EVAL: sees if it's better to just flatten the vec and get rid of
    // categorization
    pub fn update_slots(
        // goal: &mut Vec<AlgoPiece>,
        &mut self,
        updatee: Vec<AlgoPiece>,
    ) {
        let goal: &mut Vec<AlgoPiece> = &mut self.get_bucket();
        for goal_piece in goal.iter_mut() {
            let same_piece_in_updatee: Vec<AlgoPiece> = updatee
                .iter()
                .map(|f| f.clone())
                .filter(|e| e.name.eq(&goal_piece.name) && e.stat.eq(&goal_piece.stat))
                .collect();
            // 2d array [b, b, b][]
            for updatee_piece in same_piece_in_updatee {
                // current
                for (ind, current_slot) in updatee_piece.slot.iter().enumerate() {
                    // current.goal....needed
                    // true    true  > false
                    // false   true  > true
                    // true    false > false
                    // false   false > false
                    goal_piece.slot[ind] = !*current_slot && goal_piece.slot[ind];
                }
            }
        }
        *self = Self::get_set(goal);
        dbg!(&self);
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

    pub fn get_category(&self) -> AlgoCategory {
        match true {
            true if ALGO_OFFENSE.contains(&self.name) => AlgoCategory::Offense,
            true if ALGO_STABILITY.contains(&self.name) => AlgoCategory::Stability,
            _ => AlgoCategory::Special,
        }
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
