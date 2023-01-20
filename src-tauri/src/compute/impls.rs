use crate::{algorithm::types::*, state::types::*, stats::types::*, unit::types::*};

impl UserStore {
    pub fn generate_example() -> Self {
        Self {
            schema: String::from("https://raw.githubusercontent.com/mnpqraven/pnc-checklist/main/src-tauri/schemas/schema.jsonc"),
            database: Database {
                skill: SkillCurrency::default(),
                coin: Coin::default()
            },
            units: vec![
                Unit {
                    name: String::from("Croque"),
                    class: Class::Guard,
                    current: Loadout {
                        skill_level: UnitSkill { passive: 1, auto: 1 },
                        algo: AlgoSet::default(),
                        level: Level::default(),
                        neural: NeuralExpansion::Three,
                        frags: NeuralFragment::default()
                    },
                    goal: Loadout {
                        skill_level: UnitSkill::max(),
                        algo: AlgoSet {
                            offense: vec![
                                AlgoPiece {
                                    name: Algorithm::Deduction,
                                    stat: AlgoMainStat::HashratePercent,
                                    slot: AlgoSlot(vec![true, true])
                                }
                            ],
                            stability: vec![
                                AlgoPiece {
                                    name: Algorithm::Overflow,
                                    stat: AlgoMainStat::DefPercent,
                                    slot: AlgoSlot(vec![true, true, true])
                                }
                            ],
                            special: vec![
                                AlgoPiece {
                                    name: Algorithm::Stratagem,
                                    stat: AlgoMainStat::DefPercent,
                                    slot: AlgoSlot(vec![true, true])
                                }
                            ]
                        },
                        level: Level(60),
                        neural: NeuralExpansion::Five,
                        frags: NeuralFragment(None)
                    }
                }
            ]
        }
    }
}

