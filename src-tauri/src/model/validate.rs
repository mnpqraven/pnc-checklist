use crate::model::{builder::default_slot_size, infomodel::algo_category_all};

use super::infomodel::{AlgoCategory, Unit};

/// NOTE: for now validate algo integrity when changing unit class
/// only validate current set, goal TBA
/// error case returns the type of the algo that contains error (offense, stablility, special)
/// usize is the index of the error
// TODO: finish other 2 + refactor
#[tauri::command]
pub fn validate_algo(unit: Unit) -> Result<(), Vec<(AlgoCategory, Vec<usize>)>> {
    println!("validate_algo");
    let mut errs: Vec<(AlgoCategory, Vec<usize>)> = Vec::new();

    for category in algo_category_all() {
        let size: usize = default_slot_size(unit.class, category);
        let mut index_bucket: Vec<usize> = Vec::new();

        let algo_set = match category {
            AlgoCategory::Offense => &unit.current.algo.offense,
            AlgoCategory::Stability => &unit.current.algo.stability,
            AlgoCategory::Special => &unit.current.algo.special,
        };

        for (index, item) in algo_set.iter().enumerate() {
            let trues: usize = item.slot.iter().filter(|e| **e).count();
            if trues > size {
                println!(
                    "TODO: err @ index {}, cat {:?}, item {:?}",
                    index, category, item
                );
                index_bucket.push(index)
            }
        }

        if !index_bucket.is_empty() {
            errs.push((category, index_bucket));
        }
    }
    match errs.is_empty() {
        true => Ok(()),
        false => Err(errs),
    }
}

#[cfg(test)]
mod test {
    use crate::model::infomodel::{
        AlgoCategory, AlgoMainStat, AlgoPiece, AlgoSet, Algorithm, Loadout, Unit, UnitSkill,
    };

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
            class: crate::model::infomodel::Class::Sniper,
            current: Loadout {
                skill_level: UnitSkill {
                    passive: 7,
                    auto: 7,
                },
                algo: algo_set.clone(),
            },
            goal: Loadout {
                skill_level: UnitSkill { passive: 10, auto: 10 },
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
            },
        };
        let right: Vec<(AlgoCategory, Vec<usize>)> = vec![
            (AlgoCategory::Stability, [2].to_vec()),
            (AlgoCategory::Special, [0, 2].to_vec()),
        ];
        assert_eq!(validate_algo(unit_false), Err(right));

        let mut scnd_set = algo_set;
        scnd_set.stability[2].slot = vec![false,false,false];
        scnd_set.special[0].slot = vec![false,false,false];
        scnd_set.special[2].slot = vec![false,false,false];
        let scnd_unit = Unit {
            name: "hubble".to_string(),
            class: crate::model::infomodel::Class::Sniper,
            current: Loadout {
                skill_level: UnitSkill {
                    passive: 7,
                    auto: 7,
                },
                algo: scnd_set
            },
            goal: Loadout {
                skill_level: UnitSkill { passive: 10, auto: 10 },
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
            },
        };
        assert_eq!(validate_algo(scnd_unit), Ok(()));
    }
}
