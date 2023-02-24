use crate::{
    algorithm::types::*, consts::ENDPOINT_URL, state::types::*, stats::types::*, unit::types::*, loadout::types::LoadoutType,
};

impl UserJSON {
    pub fn generate_example() -> Self {
        Self {
            schema: String::from(ENDPOINT_URL),
            database: Database {
                skill: SkillCurrency::default(),
                coin: Coin::default(),
            },
            units: vec![Unit {
                name: String::from("Croque"),
                class: Class::Guard,
                current: Loadout {
                    loadout_type: LoadoutType::Current,
                    skill_level: UnitSkill {
                        passive: 1,
                        auto: 1,
                    },
                    algo: AlgoSet::default(),
                    level: Level::default(),
                    neural: NeuralExpansion::Three,
                    frags: NeuralFragment::default(),
                },
                goal: Loadout {
                    loadout_type: LoadoutType::Goal,
                    skill_level: UnitSkill::max(),
                    algo: AlgoSet {
                        offense: vec![AlgoPiece {
                            category: AlgoCategory::Offense,
                            name: Algorithm::Deduction,
                            stat: AlgoMainStat::HashratePercent,
                            slot: AlgoSlot::new_two(true, true),
                        }],
                        stability: vec![AlgoPiece {
                            category: AlgoCategory::Stability,
                            name: Algorithm::Overflow,
                            stat: AlgoMainStat::DefPercent,
                            slot: AlgoSlot::new_default(true),
                        }],
                        special: vec![AlgoPiece {
                            category: AlgoCategory::Special,
                            name: Algorithm::Stratagem,
                            stat: AlgoMainStat::DefPercent,
                            slot: AlgoSlot::new_two(true, true),
                        }],
                    },
                    level: Level(60),
                    neural: NeuralExpansion::Five,
                    frags: NeuralFragment(None),
                },
            }],
        }
    }
}
