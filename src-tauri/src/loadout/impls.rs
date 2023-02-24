use super::types::LoadoutType;
use crate::{algorithm::types::*, stats::types::*, unit::types::*};

impl Loadout {
    pub fn new(maxed_slv: bool, checked_slots: bool) -> Self {
        let skill_level = match maxed_slv {
            true => UnitSkill::max(),
            false => UnitSkill::default(),
        };
        Self {
            skill_level,
            algo: AlgoSet::new(checked_slots),
            level: Level(1),
            neural: NeuralExpansion::Three,
            frags: NeuralFragment::default(),
            loadout_type: LoadoutType::Current,
        }
    }

    pub fn new_goal() -> Self {
        Self {
            skill_level: UnitSkill::max(),
            level: Level::max(),
            algo: AlgoSet::new(true),
            neural: NeuralExpansion::Five,
            frags: NeuralFragment(None),
            loadout_type: LoadoutType::Goal,
        }
    }

    pub fn get_algos(&self) -> Vec<&AlgoPiece> {
        self.algo
            .offense
            .iter()
            .chain(self.algo.stability.iter())
            .chain(self.algo.special.iter())
            .collect::<Vec<&AlgoPiece>>()
    }
}
