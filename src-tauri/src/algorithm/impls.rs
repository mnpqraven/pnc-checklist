use strum::IntoEnumIterator;

use super::types::*;
use crate::table::{
    consts::{
        ALGO_MAINSTAT_OFFENSE, ALGO_MAINSTAT_SPECIAL, ALGO_MAINSTAT_STABILITY, ALGO_OFFENSE,
        ALGO_SPECIAL, ALGO_STABILITY,
    },
    types::Day,
};

impl Algorithm {
    pub fn default(category: &AlgoCategory) -> Self {
        match category {
            AlgoCategory::Offense => Algorithm::MLRMatrix,
            AlgoCategory::Stability => Algorithm::Encapsulate,
            AlgoCategory::Special => Algorithm::DeltaV,
        }
    }

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

    pub fn get_bonuses(day: Day) -> Vec<Algorithm> {
        match day {
            Day::Mon => vec![
                Algorithm::Encapsulate,
                Algorithm::Iteration,
                Algorithm::Perception,
                Algorithm::Inspiration,
                Algorithm::Stack,
            ],
            Day::Tue => vec![
                Algorithm::LowerLimit,
                Algorithm::Feedforward,
                Algorithm::Overflow,
                Algorithm::Rationality,
                Algorithm::LimitValue,
            ],
            Day::Wed => vec![
                Algorithm::Progression,
                Algorithm::Connection,
                Algorithm::LoopGain,
                Algorithm::SVM,
                Algorithm::Reflection,
            ],
            Day::Thu => vec![
                Algorithm::Deduction,
                Algorithm::DeltaV,
                Algorithm::Paradigm,
                Algorithm::Convolution,
                Algorithm::Exploit,
            ],
            Day::Fri => vec![
                Algorithm::DataRepair,
                Algorithm::MLRMatrix,
                Algorithm::Cluster,
                Algorithm::Stratagem,
                Algorithm::Resolve,
            ],
            Day::Sat => Vec::new(),
            Day::Sun => Vec::new(),
        }
    }

    fn get_slot_size(&self) -> usize {
        match self {
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
        }
    }
}

impl AlgoSet {
    pub fn new(checked_slots: bool) -> Self {
        Self {
            offense: vec![AlgoPiece::new(AlgoCategory::Offense, checked_slots)],
            stability: vec![AlgoPiece::new(AlgoCategory::Stability, checked_slots)],
            special: vec![AlgoPiece::new(AlgoCategory::Special, checked_slots)],
        }
    }

    /// returns all (cloned) AlgoPieces from the set as a vector
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
    /// needed, consuming the other vec
    ///
    /// * `with_goal`: Vec of `AlgoPiece` that will be pitched for comparison with
    /// the current `AlgoSet`
    pub fn apply_checkbox(
        // goal: &mut Vec<AlgoPiece>,
        &mut self,
        mut with_goal: Vec<AlgoPiece>,
    ) {
        let current: &Vec<AlgoPiece> = &self.get_bucket();
        let same_filter = |a: &AlgoPiece, b: &AlgoPiece| a.name.eq(&b.name) && a.stat.eq(&b.stat);
        // check for contains
        // algopiece is the piece from the other struct (current)
        let contain = |piece: &AlgoPiece| -> (bool, Option<Vec<&AlgoPiece>>) {
            let cont_bucket = current
                .iter()
                .filter(|current_piece| same_filter(current_piece, piece))
                .collect::<Vec<&AlgoPiece>>();
            match !cont_bucket.is_empty() {
                true => (true, Some(cont_bucket)),
                false => (false, None),
            }
        };

        for goal_piece in with_goal.iter_mut() {
            let (is_contained, in_commons) = contain(goal_piece);
            // doesn't contain, whole goal piece is processed (flip values)
            match !is_contained {
                true => {
                    goal_piece.slot.flip_values();
                }
                false => {
                    // does contain, truth table below
                    let mut current_list = in_commons
                        .unwrap()
                        .into_iter()
                        .filter(|piece| same_filter(piece, &*goal_piece))
                        .collect::<Vec<&AlgoPiece>>();

                    for current_piece in current_list.iter_mut() {
                        goal_piece.slot.check_off_current(&current_piece.slot);
                    }
                }
            }
        }
        *self = Self::get_set(&with_goal);
    }

    fn get_piece_ref(&self) -> [&Vec<AlgoPiece>; 3] {
        [&self.offense, &self.stability, &self.special]
    }

    fn get_piece_ref_mut(&mut self) -> [&mut Vec<AlgoPiece>; 3] {
        [&mut self.offense, &mut self.stability, &mut self.special]
    }

    pub fn fill_set(&mut self, all_or_none: bool) -> AlgoSet {
        self.get_piece_ref_mut().into_iter().for_each(|cat| {
            cat.iter_mut().for_each(|piece| {
                piece
                    .slot
                    .0
                    .iter_mut()
                    .for_each(|slot| slot.set(all_or_none))
            })
        });
        self.clone()
    }
}

impl AlgoPiece {
    /// creates an empty Algo piece with specified slots
    pub fn new(category: AlgoCategory, checked_slots: bool) -> Self {
        Self {
            name: Algorithm::default(&category),
            stat: AlgoMainStat::default(&category),
            slot: AlgoSlot::new_default(checked_slots),
        }
    }

    /// Compute current slots and edit it to match the spec of the new
    /// `Algorithm`
    ///
    /// * `name`: New `Algorithm` that the `AlgoPiece` is being changed to
    /// * `current_slots`:
    pub fn compute_slots(name: &Algorithm, current_slots: &AlgoSlot) -> AlgoSlot {
        let mut slots: Vec<Slot> = Vec::new();

        for n in 0..name.get_slot_size() {
            let current_slot_nth = current_slots.0.get(n);

            match current_slot_nth {
                Some(slot) => slots.push(slot.clone()),
                None => slots.push(Slot {
                    placement: SlotPlacement::Three,
                    value: false,
                }),
            }
        }
        AlgoSlot(slots)
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
    pub fn get_algo_db() -> Vec<(AlgoCategory, Vec<Algorithm>)> {
        AlgoCategory::iter()
            .map(|cat| (cat, cat.get_algos()))
            .collect()
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
    pub fn default(category: &AlgoCategory) -> Self {
        match category {
            AlgoCategory::Offense => Self::AtkPercent,
            AlgoCategory::Stability => Self::Health,
            AlgoCategory::Special => Self::Haste,
        }
    }
}

impl AlgoSlot {
    pub fn new_default(value: bool) -> Self {
        Self(vec![
            Slot {
                placement: SlotPlacement::One,
                value,
            },
            Slot {
                placement: SlotPlacement::Two,
                value,
            },
            Slot {
                placement: SlotPlacement::Three,
                value,
            },
        ])
    }

    pub fn new_two(one: bool, two: bool) -> Self {
        Self(vec![
            Slot {
                placement: SlotPlacement::One,
                value: one,
            },
            Slot {
                placement: SlotPlacement::Two,
                value: two,
            },
        ])
    }

    pub fn new_three(one: bool, two: bool, three: bool) -> Self {
        Self(vec![
            Slot {
                placement: SlotPlacement::One,
                value: one,
            },
            Slot {
                placement: SlotPlacement::Two,
                value: two,
            },
            Slot {
                placement: SlotPlacement::Three,
                value: three,
            },
        ])
    }

    /// updates the (goal) AlgoSlot with the given (current) slot
    ///
    /// * `current_slot`: [TODO:parameter]
    /// Truth table:
    /// self  .. current
    /// true  .. true   -> true
    /// false .. true   -> true
    /// true  .. false  -> false
    /// false .. false  -> true
    pub fn check_off_current(&mut self, current_slot: &AlgoSlot) {
        for (i, goal_slot) in self.0.iter_mut().enumerate() {
            *goal_slot = match (current_slot.0.get(i), goal_slot.value) {
                (None, true) => Slot {
                    placement: goal_slot.placement.clone(),
                    value: false,
                },
                (Some(s), true) if s.value => Slot {
                    placement: goal_slot.placement.clone(),
                    value: true,
                },
                (Some(s), true) if !s.value => Slot {
                    placement: goal_slot.placement.clone(),
                    value: false,
                },
                (_, false) => Slot {
                    placement: goal_slot.placement.clone(),
                    value: true,
                },
                // TODO: test
                _ => Slot {
                    placement: SlotPlacement::Three,
                    value: false,
                },
            };
        }
    }

    pub fn flip_values(&mut self) {
        for slot in self.0.iter_mut() {
            slot.set(!slot.value)
        }
    }

    pub fn merge(&mut self, mut with: Self) {
        // self: Vec({value, placement})
        self.0.append(&mut with.0);
    }
}
