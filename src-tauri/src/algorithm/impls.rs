use super::types::*;
use crate::table::{
    consts::{
        ALGO_MAINSTAT_OFFENSE, ALGO_MAINSTAT_SPECIAL, ALGO_MAINSTAT_STABILITY, ALGO_OFFENSE,
        ALGO_SPECIAL, ALGO_STABILITY,
    },
    types::Day,
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

    pub fn get_category(&self) -> AlgoCategory {
        match true {
            true if ALGO_OFFENSE.contains(self) => AlgoCategory::Offense,
            true if ALGO_STABILITY.contains(self) => AlgoCategory::Stability,
            _ => AlgoCategory::Special,
        }
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
    fn get_set(bucket: &[AlgoPiece]) -> Self {
        Self {
            offense: bucket
                .iter()
                .cloned()
                .filter(|piece| piece.get_category() == AlgoCategory::Offense)
                .collect(),
            stability: bucket
                .iter()
                .cloned()
                .filter(|piece| piece.get_category() == AlgoCategory::Stability)
                .collect(),
            special: bucket
                .iter()
                .cloned()
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
                .cloned()
                .filter(|e| e.name.eq(&goal_piece.name) && e.stat.eq(&goal_piece.stat))
                .collect();
            // 2d array [b, b, b][]
            for updatee_piece in same_piece_in_updatee {
                // current
                for (ind, current_slot) in updatee_piece.slot.0.iter().enumerate() {
                    // current.goal....needed
                    // true    true  > false
                    // false   true  > true
                    // true    false > false
                    // false   false > false
                    goal_piece.slot.0[ind] = !*current_slot && goal_piece.slot.0[ind];
                }
            }
        }
        *self = Self::get_set(goal);
    }
}

impl AlgoPiece {
    /// creates an empty Algo piece with specified slots
    pub fn new(category: AlgoCategory) -> Self {
        match category {
            AlgoCategory::Offense => Self {
                name: Algorithm::Feedforward,
                stat: AlgoMainStat::AtkPercent,
                slot: AlgoSlot::default(),
            },
            AlgoCategory::Stability => Self {
                name: Algorithm::Encapsulate,
                stat: AlgoMainStat::Health,
                slot: AlgoSlot::default()
            },
            AlgoCategory::Special => Self {
                name: Algorithm::DeltaV,
                stat: AlgoMainStat::Haste,
                slot: AlgoSlot::default()
            },
        }
    }

    /// Compute current slots and edit it to match the spec of the new
    /// `Algorithm`
    ///
    /// * `name`: New `Algorithm` that the `AlgoPiece` is being changed to
    /// * `current_slots`:
    pub fn compute_slots(name: &Algorithm, current_slots: &AlgoSlot) -> AlgoSlot {
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
            res.push(*current_slots.0.get(i).unwrap_or(&false));
        }
        AlgoSlot(res)
    }

    pub fn get_category(&self) -> AlgoCategory {
        match true {
            true if ALGO_OFFENSE.contains(&self.name) => AlgoCategory::Offense,
            true if ALGO_STABILITY.contains(&self.name) => AlgoCategory::Stability,
            _ => AlgoCategory::Special,
        }
    }
}

// TODO: refactor with chunk above
// WARN: only after double checking with frontend
impl AlgoCategory {
    pub fn generate_algo_db() -> Vec<(AlgoCategory, Vec<Algorithm>)> {
        vec![
            (
                AlgoCategory::Offense,
                Self::get_algos(&AlgoCategory::Offense),
            ),
            (
                AlgoCategory::Stability,
                Self::get_algos(&AlgoCategory::Stability),
            ),
            (
                AlgoCategory::Special,
                Self::get_algos(&AlgoCategory::Special),
            ),
        ]
    }

    pub fn get_algos(&self) -> Vec<Algorithm> {
        match self {
            AlgoCategory::Offense => ALGO_OFFENSE.to_vec(),
            AlgoCategory::Stability => ALGO_STABILITY.to_vec(),
            AlgoCategory::Special => ALGO_SPECIAL.to_vec(),
        }
    }

    pub fn get_mainstat(&self) -> Vec<AlgoMainStat> {
        match self {
            AlgoCategory::Offense => ALGO_MAINSTAT_OFFENSE.to_vec(),
            AlgoCategory::Stability => ALGO_MAINSTAT_STABILITY.to_vec(),
            AlgoCategory::Special => ALGO_MAINSTAT_SPECIAL.to_vec(),
        }
    }
}

impl AlgoMainStat {
    pub fn default(cat: &AlgoCategory) -> Self {
        match cat {
            AlgoCategory::Offense => Self::AtkPercent,
            AlgoCategory::Stability => Self::Health,
            AlgoCategory::Special => Self::Haste,
        }
    }
}

impl Default for AlgoSlot {
    fn default() -> Self {
        Self(vec![false; 3])
    }
}
