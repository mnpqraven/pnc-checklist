use crate::model::structs::{Level, Unit, Class, Loadout, UnitSkill, NeuralExpansion, NeuralFragment, AlgoPiece};

impl UnitSkill {
    pub fn new() -> Self {
        Self {
            passive: 1,
            auto: 1,
        }
    }
    pub fn max() -> Self {
        Self {
            passive: 10,
            auto: 10,
        }
    }
}

impl Level {
    pub fn max() -> Self {
        Self(70)
    }
}
// UNIT
impl Unit {
    pub fn new(name: String, class: Class) -> Self {
        Self {
            name,
            class,
            current: Loadout::new(false),
            goal: Loadout::new_goal(),
        }
    }

    pub fn _get_missing_algos(&self) -> Vec<AlgoPiece> {
        let mut v: Vec<AlgoPiece> = Vec::new();
        // iterates over each category and checks for equality
        let listcurrent = vec![
            &self.current.algo.offense,
            &self.current.algo.stability,
            &self.current.algo.special,
        ];
        let listgoal = vec![
            &self.goal.algo.offense,
            &self.goal.algo.stability,
            &self.goal.algo.special,
        ];
        // TODO: test
        for (ind, cat_ptr) in listgoal.iter().enumerate() {
            for piece_goal in cat_ptr.iter() {
                if !listcurrent[ind].contains(piece_goal) {
                    v.push(piece_goal.to_owned())
                }
            }
        }

        v
    }
}
impl Default for NeuralExpansion {
    fn default() -> Self {
        Self::Two
    }
}
impl Default for UnitSkill {
    fn default() -> Self {
        Self {
            passive: 1,
            auto: 1,
        }
    }
}
impl Default for Level {
    fn default() -> Self {
        Self(1)
    }
}
impl Default for NeuralFragment {
    fn default() -> Self {
        Self(Some(0))
    }
}
