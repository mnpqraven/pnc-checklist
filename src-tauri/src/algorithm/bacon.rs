use super::{
    dev_print_single_main,
    types::{AlgoCategory, AlgoSet},
};
use crate::algorithm::types::{AlgoMainStat, AlgoPiece, AlgoSlot, Algorithm};

#[test]
fn slots_small_to_big() {
    let right = AlgoPiece::compute_slots(&Algorithm::DeltaV, &AlgoSlot(vec![true, true]));
    assert_eq!(AlgoSlot(vec![true, true, false]), right);

    let right = AlgoPiece::compute_slots(&Algorithm::MLRMatrix, &AlgoSlot(vec![false, true]));
    assert_eq!(AlgoSlot(vec![false, true, false]), right);
}
#[test]
fn slots_big_to_small() {
    let right = AlgoPiece::compute_slots(&Algorithm::Connection, &AlgoSlot(vec![true, true, true]));
    assert_eq!(AlgoSlot(vec![true, true]), right);

    let right =
        AlgoPiece::compute_slots(&Algorithm::Inspiration, &AlgoSlot(vec![true, false, true]));
    assert_eq!(AlgoSlot(vec![true, false]), right);

    let right =
        AlgoPiece::compute_slots(&Algorithm::Feedforward, &AlgoSlot(vec![false, true, false]));
    assert_eq!(AlgoSlot(vec![false, true]), right);
}
#[test]
fn algodb_refactor() {
    let before = vec![
        (
            AlgoCategory::Offense,
            AlgoCategory::get_algos(&AlgoCategory::Offense),
        ),
        (
            AlgoCategory::Stability,
            AlgoCategory::get_algos(&AlgoCategory::Stability),
        ),
        (
            AlgoCategory::Special,
            AlgoCategory::get_algos(&AlgoCategory::Special),
        ),
    ];
    let after = AlgoCategory::get_algo_db();
    assert_eq!(before, after);
}

#[test]
fn update_slots_pass() {
    let mut current_set: AlgoSet = AlgoSet {
        offense: vec![
            AlgoPiece {
                name: Algorithm::Feedforward,
                stat: AlgoMainStat::AtkPercent,
                slot: AlgoSlot(vec![false, true]),
            },
            AlgoPiece {
                name: Algorithm::MLRMatrix,
                stat: AlgoMainStat::HashratePercent,
                slot: AlgoSlot(vec![false, false, true]),
            },
        ],
        stability: vec![AlgoPiece {
            name: Algorithm::Encapsulate,
            stat: AlgoMainStat::Health,
            slot: AlgoSlot(vec![false, true, false]),
        }],
        special: vec![AlgoPiece {
            name: Algorithm::DeltaV,
            stat: AlgoMainStat::Haste,
            slot: AlgoSlot(vec![false, false, true]),
        }],
    };

    let with_goal: Vec<AlgoPiece> = vec![
        AlgoPiece {
            name: Algorithm::MLRMatrix,
            stat: AlgoMainStat::AtkPercent,
            slot: AlgoSlot(vec![true, true, true]),
        },
        AlgoPiece {
            name: Algorithm::Encapsulate,
            stat: AlgoMainStat::Health,
            slot: AlgoSlot(vec![true, true, false]),
        },
        AlgoPiece {
            name: Algorithm::DeltaV,
            stat: AlgoMainStat::Haste,
            slot: AlgoSlot(vec![true, true, false]),
        },
    ];
    current_set.apply_checkbox(with_goal);

    let right: AlgoSet = AlgoSet {
        offense: vec![AlgoPiece {
            name: Algorithm::MLRMatrix,
            stat: AlgoMainStat::AtkPercent,
            slot: AlgoSlot(vec![false, false, false]),
        }],
        stability: vec![AlgoPiece {
            name: Algorithm::Encapsulate,
            stat: AlgoMainStat::Health,
            slot: AlgoSlot(vec![false, true, true]),
        }],
        special: vec![AlgoPiece {
            name: Algorithm::DeltaV,
            stat: AlgoMainStat::Haste,
            slot: AlgoSlot(vec![false, false, true]),
        }],
    };
    assert_eq!(current_set.offense, right.offense);
    assert_eq!(current_set.stability, right.stability);
    assert_eq!(current_set.special, right.special);
}

#[test]
fn update_slots_pass_partial() {
    let mut set: AlgoSet = AlgoSet {
        offense: vec![],
        stability: vec![AlgoPiece {
            name: Algorithm::Encapsulate,
            stat: AlgoMainStat::Health,
            slot: AlgoSlot(vec![false, true, false]),
        }],
        special: vec![AlgoPiece {
            name: Algorithm::DeltaV,
            stat: AlgoMainStat::Haste,
            slot: AlgoSlot(vec![false, false, true]),
        }],
    };

    let with_goal: Vec<AlgoPiece> = vec![
        AlgoPiece {
            name: Algorithm::MLRMatrix,
            stat: AlgoMainStat::AtkPercent,
            slot: AlgoSlot(vec![true, true, true]),
        },
        AlgoPiece {
            name: Algorithm::Encapsulate,
            stat: AlgoMainStat::Health,
            slot: AlgoSlot(vec![true, true, false]),
        },
        AlgoPiece {
            name: Algorithm::DeltaV,
            stat: AlgoMainStat::Haste,
            slot: AlgoSlot(vec![true, true, false]),
        },
    ];
    set.apply_checkbox(with_goal);

    let right: AlgoSet = AlgoSet {
        offense: vec![AlgoPiece {
            name: Algorithm::MLRMatrix,
            stat: AlgoMainStat::AtkPercent,
            slot: AlgoSlot(vec![false, false, false]),
        }],
        stability: vec![AlgoPiece {
            name: Algorithm::Encapsulate,
            stat: AlgoMainStat::Health,
            slot: AlgoSlot(vec![false, true, true]),
        }],
        special: vec![AlgoPiece {
            name: Algorithm::DeltaV,
            stat: AlgoMainStat::Haste,
            slot: AlgoSlot(vec![false, false, true]),
        }],
    };
    assert_eq!(set.offense, right.offense);
    assert_eq!(set.stability, right.stability);
    assert_eq!(set.special, right.special);
}

#[test]
fn mainstat_display() {
    let m = AlgoMainStat::OperandPenPercent;
    assert_eq!(dev_print_single_main(m), "Operand Pen. %");
    assert_eq!(dev_print_single_main(AlgoMainStat::Dodge), "Dodge");
}

#[test]
fn set_filling() {
    let mut left: AlgoSet = AlgoSet {
        offense: vec![],
        stability: [AlgoPiece {
            name: Algorithm::Encapsulate,
            stat: AlgoMainStat::Health,
            slot: AlgoSlot([false, true, false].to_vec()),
        }; 1]
            .to_vec(),
        special: vec![AlgoPiece {
            name: Algorithm::DeltaV,
            stat: AlgoMainStat::Haste,
            slot: AlgoSlot(vec![false, false, true]),
        }],
    };
    let right: AlgoSet = AlgoSet {
        offense: vec![],
        stability: [AlgoPiece {
            name: Algorithm::Encapsulate,
            stat: AlgoMainStat::Health,
            slot: AlgoSlot([true, true, true].to_vec()),
        }; 1]
            .to_vec(),
        special: vec![AlgoPiece {
            name: Algorithm::DeltaV,
            stat: AlgoMainStat::Haste,
            slot: AlgoSlot(vec![true, true, true]),
        }],
    };
    assert_eq!(left.fill_set(true), right);
    assert_eq!(left, right);
}
