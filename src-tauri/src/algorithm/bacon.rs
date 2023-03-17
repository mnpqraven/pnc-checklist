use super::{
    print_main_stat,
    types::{AlgoCategory, IAlgoSet},
};
use crate::algorithm::types::{AlgoMainStat, IAlgoPiece, IAlgoSlot, Algorithm};

#[test]
fn slots_small_to_big() {
    let right = IAlgoPiece::compute_slots(&Algorithm::DeltaV, &IAlgoSlot::new_two(true, true));
    assert_eq!(IAlgoSlot::new_three(true, true, false), right);

    let right = IAlgoPiece::compute_slots(&Algorithm::MLRMatrix, &IAlgoSlot::new_two(false, true));
    assert_eq!(IAlgoSlot::new_three(false, true, false), right);
}
#[test]
fn slots_big_to_small() {
    let right = IAlgoPiece::compute_slots(
        &Algorithm::Connection,
        &IAlgoSlot::new_three(true, true, true),
    );
    assert_eq!(IAlgoSlot::new_two(true, true), right);

    let right = IAlgoPiece::compute_slots(
        &Algorithm::Inspiration,
        &IAlgoSlot::new_three(true, false, true),
    );
    assert_eq!(IAlgoSlot::new_two(true, false), right);

    let right = IAlgoPiece::compute_slots(
        &Algorithm::Feedforward,
        &IAlgoSlot::new_three(false, true, false),
    );
    assert_eq!(IAlgoSlot::new_two(false, true), right);
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
    let mut current_set: IAlgoSet = IAlgoSet {
        offense: vec![
            IAlgoPiece::new_detailed(
                Algorithm::Feedforward,
                AlgoMainStat::AtkPercent,
                false,
                true,
                false,
            ),
            IAlgoPiece::new_detailed(
                Algorithm::MLRMatrix,
                AlgoMainStat::HashratePercent,
                false,
                false,
                true,
            ),
        ],
        stability: vec![IAlgoPiece::new_detailed(
            Algorithm::Encapsulate,
            AlgoMainStat::Health,
            false,
            true,
            false,
        )],
        special: vec![IAlgoPiece::new_detailed(
            Algorithm::DeltaV,
            AlgoMainStat::Haste,
            false,
            false,
            true,
        )],
    };

    let with_goal: Vec<IAlgoPiece> = vec![
        IAlgoPiece::new_detailed(
            Algorithm::MLRMatrix,
            AlgoMainStat::AtkPercent,
            true,
            true,
            true,
        ),
        IAlgoPiece::new_detailed(
            Algorithm::Encapsulate,
            AlgoMainStat::Health,
            true,
            true,
            false,
        ),
        IAlgoPiece::new_detailed(Algorithm::DeltaV, AlgoMainStat::Haste, true, true, false),
    ];
    current_set.apply_checkbox(with_goal);

    let right: IAlgoSet = IAlgoSet {
        offense: vec![IAlgoPiece::new_detailed(
            Algorithm::MLRMatrix,
            AlgoMainStat::AtkPercent,
            false,
            false,
            false,
        )],
        stability: vec![IAlgoPiece::new_detailed(
            Algorithm::Encapsulate,
            AlgoMainStat::Health,
            false,
            true,
            true,
        )],
        special: vec![IAlgoPiece::new_detailed(
            Algorithm::DeltaV,
            AlgoMainStat::Haste,
            false,
            false,
            true,
        )],
    };
    assert_eq!(current_set.offense, right.offense);
    assert_eq!(current_set.stability, right.stability);
    assert_eq!(current_set.special, right.special);
}

#[test]
fn update_slots_pass_partial() {
    let mut set: IAlgoSet = IAlgoSet {
        offense: vec![],
        stability: vec![IAlgoPiece::new_detailed(
            Algorithm::Encapsulate,
            AlgoMainStat::Health,
            false,
            true,
            false,
        )],
        special: vec![IAlgoPiece::new_detailed(
            Algorithm::DeltaV,
            AlgoMainStat::Haste,
            false,
            false,
            true,
        )],
    };

    let with_goal: Vec<IAlgoPiece> = vec![
        IAlgoPiece::new_detailed(
            Algorithm::MLRMatrix,
            AlgoMainStat::AtkPercent,
            true,
            true,
            true,
        ),
        IAlgoPiece::new_detailed(
            Algorithm::Encapsulate,
            AlgoMainStat::Health,
            true,
            true,
            false,
        ),
        IAlgoPiece::new_detailed(Algorithm::DeltaV, AlgoMainStat::Haste, true, true, false),
    ];
    set.apply_checkbox(with_goal);

    let right: IAlgoSet = IAlgoSet {
        offense: vec![IAlgoPiece::new_detailed(
            Algorithm::MLRMatrix,
            AlgoMainStat::AtkPercent,
            false,
            false,
            false,
        )],
        stability: vec![IAlgoPiece::new_detailed(
            Algorithm::Encapsulate,
            AlgoMainStat::Health,
            false,
            true,
            true,
        )],
        special: vec![IAlgoPiece::new_detailed(
            Algorithm::DeltaV,
            AlgoMainStat::Haste,
            false,
            false,
            true,
        )],
    };
    assert_eq!(set.offense, right.offense);
    assert_eq!(set.stability, right.stability);
    assert_eq!(set.special, right.special);
}

#[test]
fn mainstat_display() {
    let m = AlgoMainStat::OperandPenPercent;
    assert_eq!(print_main_stat(m), "Operand Pen. %");
    assert_eq!(print_main_stat(AlgoMainStat::Dodge), "Dodge");
}

#[test]
fn set_filling() {
    let mut left: IAlgoSet = IAlgoSet {
        offense: vec![],
        stability: [IAlgoPiece::new_detailed(
            Algorithm::Encapsulate,
            AlgoMainStat::Health,
            false,
            true,
            false,
        ); 1]
            .to_vec(),
        special: vec![IAlgoPiece::new_detailed(
            Algorithm::DeltaV,
            AlgoMainStat::Haste,
            false,
            false,
            true,
        )],
    };
    let right: IAlgoSet = IAlgoSet {
        offense: vec![],
        stability: [IAlgoPiece::new_detailed(
            Algorithm::Encapsulate,
            AlgoMainStat::Health,
            true,
            true,
            true,
        ); 1]
            .to_vec(),
        special: vec![IAlgoPiece::new_detailed(
            Algorithm::DeltaV,
            AlgoMainStat::Haste,
            true,
            true,
            true,
        )],
    };
    assert_eq!(left.fill_set(true), right);
    assert_eq!(left, right);
}
