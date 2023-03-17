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
            units: vec![IUnit {
                name: String::from("Croque"),
                class: Class::Guard,
                current: ILoadout {
                    loadout_type: LoadoutType::Current,
                    skill_level: IUnitSkill {
                        passive: 1,
                        auto: 1,
                    },
                    algo: IAlgoSet::default(),
                    level: ILevel::default(),
                    neural: NeuralExpansion::Three,
                    frags: INeuralFragment::default(),
                },
                goal: ILoadout {
                    loadout_type: LoadoutType::Goal,
                    skill_level: IUnitSkill::max(),
                    algo: IAlgoSet {
                        offense: vec![IAlgoPiece {
                            category: AlgoCategory::Offense,
                            name: Algorithm::Deduction,
                            stat: AlgoMainStat::HashratePercent,
                            slot: IAlgoSlot::new_two(true, true),
                        }],
                        stability: vec![IAlgoPiece {
                            category: AlgoCategory::Stability,
                            name: Algorithm::Overflow,
                            stat: AlgoMainStat::DefPercent,
                            slot: IAlgoSlot::new_default(true),
                        }],
                        special: vec![IAlgoPiece {
                            category: AlgoCategory::Special,
                            name: Algorithm::Stratagem,
                            stat: AlgoMainStat::DefPercent,
                            slot: IAlgoSlot::new_two(true, true),
                        }],
                    },
                    level: ILevel(60),
                    neural: NeuralExpansion::Five,
                    frags: INeuralFragment(None),
                },
            }],
        }
    }
}
