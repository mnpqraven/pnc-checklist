use super::{NeuralExpansion, NeuralResourceRequirement, WidgetResourceRequirement};
use crate::algorithm::types::{AlgoMainStat, AlgoPiece, AlgoSet, AlgoSlot, Algorithm};
use crate::requirement::types::AlgorithmRequirement;
use crate::requirement::LevelRequirement;
use crate::requirement_slv;
use crate::stats::types::*;
use crate::unit::types::{Class, Unit};

#[test]
fn test_skill_total() {
    let unit_skill = UnitSkill {
        passive: 5,
        auto: 8,
    };
    let calc = requirement_slv(
        unit_skill,
        UnitSkill {
            passive: 10,
            auto: 10,
        },
    );
    assert_eq!(calc.token, 16680);
    assert_eq!(calc.pivot, 44);
}
#[test]
fn test_skill_halfway() {
    let unit_skill = UnitSkill {
        passive: 5,
        auto: 8,
    };
    let calc = requirement_slv(
        unit_skill,
        UnitSkill {
            passive: 9,
            auto: 9,
        },
    );
    assert_eq!(calc.pivot, 20);
}

#[test]
fn levelreq() {
    assert_eq!(43 / 10, 4);
    assert_eq!(LevelRequirement::calculate(29, 30).unwrap().exp.0, 2190);
    assert_eq!(
        LevelRequirement::calculate(29, 31).unwrap().exp.0,
        2190 + 2450
    );
    assert_eq!(
        LevelRequirement::calculate(29, 41).unwrap().exp.0,
        2190 + 30410 + 3990
    );
    assert_eq!(
        LevelRequirement::calculate(27, 62).unwrap().exp.0,
        1540 + 1930 + 2190 + 30410 + 54390 + 105490 + 17000 + 22000
    );
}
#[test]
fn level_to60bound() {
    assert_eq!(LevelRequirement::calculate(1, 60).unwrap().exp.0, 213540);
    assert_eq!(
        LevelRequirement::calculate(50, 69).unwrap().exp.0,
        600000 + 105490 - 119000
    );
}
#[test]
fn level_to70bound() {
    assert_eq!(
        LevelRequirement::calculate(50, 70).unwrap().exp.0,
        600000 + 105490
    );
    assert_eq!(LevelRequirement::calculate(1, 70).unwrap().exp.0, 813540);
    assert_eq!(LevelRequirement::calculate(60, 70).unwrap().exp.0, 600000);
}
#[test]
fn neuralreq() {
    assert_eq!(
        NeuralResourceRequirement::calculate(
            NeuralFragment::default(),
            NeuralExpansion::One,
            NeuralExpansion::Five
        )
        .unwrap()
        .frags,
        NeuralFragment(Some(400))
    );
    assert_eq!(
        NeuralResourceRequirement::calculate(
            NeuralFragment::default(),
            NeuralExpansion::Three,
            NeuralExpansion::Five
        )
        .unwrap()
        .frags,
        NeuralFragment(Some(320))
    );
    assert_eq!(
        NeuralResourceRequirement::calculate(
            NeuralFragment::default(),
            NeuralExpansion::Two,
            NeuralExpansion::FourHalf
        )
        .unwrap()
        .frags,
        NeuralFragment(Some(25 + 40 + 60 + 70 + 90))
    )
}
#[test]
fn widget_1() {
    assert_eq!(
        WidgetResourceRequirement::calculate(Class::Guard, 1, 11)
            .unwrap()
            .coin
            .0,
        500
    );
    assert_eq!(
        WidgetResourceRequirement::calculate(Class::Guard, 1, 11)
            .unwrap()
            .widget
            .widget_inventory,
        [10, 0, 0, 0, 0, 0]
    );
}
#[test]
fn widget_2() {
    assert_eq!(
        WidgetResourceRequirement::calculate(Class::Guard, 1, 70)
            .unwrap()
            .coin
            .0,
        7500 + 150000
    );
    assert_eq!(
        WidgetResourceRequirement::calculate(Class::Guard, 1, 70)
            .unwrap()
            .widget
            .widget_inventory,
        [20, 30, 35, 45, 55, 35]
    );
}
#[test]
fn widget_3() {
    assert_eq!(
        WidgetResourceRequirement::calculate(Class::Guard, 19, 40)
            .unwrap()
            .coin
            .0,
        17000
    );
    assert_eq!(
        WidgetResourceRequirement::calculate(Class::Guard, 19, 40)
            .unwrap()
            .widget
            .widget_inventory,
        [10, 30, 35, 25, 0, 0]
    );
}
#[test]
fn widget_4() {
    assert_eq!(
        WidgetResourceRequirement::calculate(Class::Guard, 19, 39)
            .unwrap()
            .coin
            .0,
        7000
    );
    assert_eq!(
        WidgetResourceRequirement::calculate(Class::Guard, 19, 39)
            .unwrap()
            .widget
            .widget_inventory,
        [10, 30, 20, 0, 0, 0]
    );
}
#[test]
fn widget_5() {
    assert_eq!(
        WidgetResourceRequirement::calculate(Class::Guard, 21, 28)
            .unwrap()
            .coin
            .0,
        0
    );
    assert_eq!(
        WidgetResourceRequirement::calculate(Class::Guard, 21, 28)
            .unwrap()
            .widget
            .widget_inventory,
        [0, 0, 0, 0, 0, 0]
    );
}
#[test]
fn kits_conversion() {
    let t = NeuralResourceRequirement::calculate_kits_conversion(
        NeuralFragment(None),
        NeuralExpansion::Three,
        NeuralExpansion::Five,
    )
    .unwrap();
    // 320
    let a = 25 * (5 + 10 + 15 + 20);
    let b = (320 - 100) * 25;
    assert_eq!(t, a + b);
}
#[test]
fn kits_2() {
    let t = NeuralResourceRequirement::calculate_kits_conversion(
        NeuralFragment(Some(10)),
        NeuralExpansion::Four,
        NeuralExpansion::Five,
    );
    // 90 + 100 - 10 = 180
    let a = 25 * (5 + 10 + 15 + 20); // 100
    let b = 25 * 80;
    assert_eq!(t.unwrap(), a + b);
}

#[test]
fn missing_display() {
    let pieces: Vec<AlgoPiece> = vec![
        AlgoPiece {
            name: Algorithm::Feedforward,
            stat: AlgoMainStat::AtkPercent,
            slot: AlgoSlot::new_three(false, false, true),
        },
        AlgoPiece {
            name: Algorithm::Encapsulate,
            stat: AlgoMainStat::Health,
            slot: AlgoSlot::new_three(false, true, true),
        },
        AlgoPiece {
            name: Algorithm::DeltaV,
            stat: AlgoMainStat::Haste,
            slot: AlgoSlot::new_three(true, false, false),
        },
    ];
    let from_unit = Unit::default();
    let algo_req = AlgorithmRequirement { pieces, from_unit };
    dbg!(algo_req.is_fulfilled());
    assert_eq!(1, 1);
}

#[test]
fn fulfilled() {
    let mut set: AlgoSet = AlgoSet {
        offense: vec![],
        stability: vec![AlgoPiece {
            name: Algorithm::Encapsulate,
            stat: AlgoMainStat::Health,
            slot: AlgoSlot::new_three(false, true, false),
        }],
        special: vec![],
    };

    let with_goal: Vec<AlgoPiece> = vec![
        AlgoPiece {
            name: Algorithm::Encapsulate,
            stat: AlgoMainStat::Health,
            slot: AlgoSlot::new_default(false),
        },
        AlgoPiece {
            name: Algorithm::Encapsulate,
            stat: AlgoMainStat::Health,
            slot: AlgoSlot::new_three(false, true, false),
        },
    ];
    set.apply_checkbox(with_goal);

    // NOTE: goal pieces are not checked for duplication for now
    let right: AlgoSet = AlgoSet {
        offense: vec![],
        stability: vec![
            AlgoPiece {
                name: Algorithm::Encapsulate,
                stat: AlgoMainStat::Health,
                slot: AlgoSlot::new_default(true),
            },
            AlgoPiece {
                name: Algorithm::Encapsulate,
                stat: AlgoMainStat::Health,
                slot: AlgoSlot::new_default(true),
            },
        ],
        special: vec![],
    };
    assert_eq!(set.offense, right.offense);
    assert_eq!(set.stability, right.stability);
    assert_eq!(set.special, right.special);
    let req = AlgorithmRequirement {
        pieces: set.get_bucket(),
        from_unit: Unit::default(),
    };
    assert!(req.is_fulfilled())
}
