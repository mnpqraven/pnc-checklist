use crate::{algorithm::types::*, model::error::ValidationError, stats::types::*, unit::types::*};

use super::validate_algo;

#[test]
// TODO: needs helper fns
fn validalgo() {
    let algo_set: AlgoSet = AlgoSet {
        offense: vec![AlgoPiece {
            name: Algorithm::Feedforward,
            stat: AlgoMainStat::AtkPercent,
            slot: vec![true, true, true],
        }],
        stability: vec![
            AlgoPiece {
                name: Algorithm::Overflow,
                stat: AlgoMainStat::AtkPercent,
                slot: vec![true, false, false],
            },
            AlgoPiece {
                name: Algorithm::Overflow,
                stat: AlgoMainStat::AtkPercent,
                slot: vec![true, false, true],
            },
            AlgoPiece {
                name: Algorithm::Overflow,
                stat: AlgoMainStat::AtkPercent,
                slot: vec![true, true, true], // mark
            },
        ],
        special: vec![
            AlgoPiece {
                name: Algorithm::DeltaV,
                stat: AlgoMainStat::Haste,
                slot: vec![true, true, true], // mark
            },
            AlgoPiece {
                name: Algorithm::Paradigm,
                stat: AlgoMainStat::Haste,
                slot: vec![true, false, true],
            },
            AlgoPiece {
                name: Algorithm::SVM,
                stat: AlgoMainStat::Haste,
                slot: vec![true, true, true], // mark
            },
        ],
    };
    let unit_false = Unit {
        name: "hubble".to_string(),
        class: Class::Sniper,
        current: Loadout {
            skill_level: UnitSkill {
                passive: 7,
                auto: 7,
            },
            algo: algo_set.clone(),
            level: Level(1),
            neural: NeuralExpansion::Three,
            frags: NeuralFragment::default(),
        },
        goal: Loadout {
            skill_level: UnitSkill {
                passive: 10,
                auto: 10,
            },
            neural: NeuralExpansion::Three,
            algo: AlgoSet {
                offense: vec![AlgoPiece {
                    name: Algorithm::Feedforward,
                    stat: AlgoMainStat::AtkPercent,
                    slot: vec![true, true, true],
                }],
                stability: vec![AlgoPiece {
                    name: Algorithm::Encapsulate,
                    stat: AlgoMainStat::Health,
                    slot: vec![true, true, true],
                }],
                special: vec![AlgoPiece {
                    name: Algorithm::DeltaV,
                    stat: AlgoMainStat::Haste,
                    slot: vec![true, true, true],
                }],
            },
            level: Level(1),
            frags: NeuralFragment(None),
        },
    };
    let right: Vec<(AlgoCategory, Vec<usize>)> = vec![
        (AlgoCategory::Stability, [2].to_vec()),
        (AlgoCategory::Special, [0, 2].to_vec()),
    ];
    assert_eq!(
        validate_algo(&unit_false),
        Err(ValidationError::Algorithm(right))
    );

    let mut scnd_set = algo_set;
    scnd_set.stability[2].slot = vec![false, false, false];
    scnd_set.special[0].slot = vec![false, false, false];
    scnd_set.special[2].slot = vec![false, false, false];
    let scnd_unit = Unit {
        name: "hubble".to_string(),
        class: Class::Sniper,
        current: Loadout {
            skill_level: UnitSkill {
                passive: 7,
                auto: 7,
            },
            neural: NeuralExpansion::Three,
            algo: scnd_set,
            level: Level(1),
            frags: NeuralFragment::default(),
        },
        goal: Loadout {
            skill_level: UnitSkill {
                passive: 10,
                auto: 10,
            },
            neural: NeuralExpansion::Three,
            algo: AlgoSet {
                offense: vec![AlgoPiece {
                    name: Algorithm::Feedforward,
                    stat: AlgoMainStat::AtkPercent,
                    slot: vec![true, true, true],
                }],
                stability: vec![AlgoPiece {
                    name: Algorithm::Encapsulate,
                    stat: AlgoMainStat::Health,
                    slot: vec![true, true, true],
                }],
                special: vec![AlgoPiece {
                    name: Algorithm::DeltaV,
                    stat: AlgoMainStat::Haste,
                    slot: vec![true, true, true],
                }],
            },
            level: Level(1),
            frags: NeuralFragment(None),
        },
    };
    assert_eq!(validate_algo(&scnd_unit), Ok(()));
}
