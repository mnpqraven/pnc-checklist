use crate::{algorithm::types::*, unit::types::*};

#[test]
fn missing_algo() {
    let set = AlgoSet {
        offense: vec![AlgoPiece {
            name: Algorithm::Feedforward,
            stat: AlgoMainStat::AtkPercent,
            slot: vec![false, false, false],
        }], //feed atk%
        stability: vec![AlgoPiece {
            name: Algorithm::Encapsulate,
            stat: AlgoMainStat::Health,
            slot: vec![false, true, false],
        }], // enc hp
        special: vec![
            AlgoPiece {
                name: Algorithm::DeltaV,
                stat: AlgoMainStat::Haste,
                slot: vec![true, false, false],
            },
            AlgoPiece {
                name: Algorithm::SVM,
                stat: AlgoMainStat::HealInc,
                slot: vec![true, false, false],
            },
        ],
    };
    let mut set2 = set.clone();
    set2.offense[0].slot = vec![true, true, false];
    set2.stability[0].slot = vec![true, true, false];
    set2.special = vec![AlgoPiece {
        name: Algorithm::DeltaV,
        stat: AlgoMainStat::Haste,
        slot: vec![true, true, true],
    }];
    let current = Loadout {
        algo: set,
        ..Default::default()
    };
    let goal = Loadout {
        algo: set2,
        ..Default::default()
    };

    let t: Unit = Unit {
        name: "test 1".to_string(),
        class: Class::Medic,
        current,
        goal,
    };

    let right: Vec<AlgoPiece> = vec![
        AlgoPiece {
            name: Algorithm::Feedforward,
            stat: AlgoMainStat::AtkPercent,
            slot: vec![true, true, false],
        },
        AlgoPiece {
            name: Algorithm::Encapsulate,
            stat: AlgoMainStat::Health,
            slot: vec![true, false, false],
        },
        AlgoPiece {
            name: Algorithm::DeltaV,
            stat: AlgoMainStat::Haste,
            slot: vec![false, true, true],
        },
    ];
    let left = t.get_missing_algos();
    assert_eq!(left, right);
}