use crate::model::structs::{AlgoSet, Level, Loadout, NeuralExpansion, NeuralFragment, UnitSkill};

impl Loadout {
    pub fn new(maxed_slv: bool) -> Self {
        match maxed_slv {
            true => Self {
                skill_level: UnitSkill::max(),
                algo: AlgoSet::new(),
                level: Level(1),
                neural: NeuralExpansion::Three,
                frags: NeuralFragment::default(),
            },
            false => Self {
                skill_level: UnitSkill::new(),
                algo: AlgoSet::new(),
                level: Level(1),
                neural: NeuralExpansion::Three,
                frags: NeuralFragment::default(),
            },
        }
    }

    pub fn new_goal() -> Self {
        Self {
            skill_level: UnitSkill::max(),
            level: Level::max(),
            algo: AlgoSet::new(),
            neural: NeuralExpansion::Five,
            frags: NeuralFragment(None),
        }
    }
}

impl Default for Loadout {
    fn default() -> Self {
        Self {
            skill_level: Default::default(),
            level: Default::default(),
            algo: Default::default(),
            neural: Default::default(),
            frags: Default::default(),
        }
    }
}
