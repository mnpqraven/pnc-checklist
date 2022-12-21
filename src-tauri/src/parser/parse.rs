#[cfg(test)]
mod tests {
    use std::fs;

    use crate::model::infomodel::{
        AlgoMainStat, AlgoPiece, AlgoSet, Algorithm, Class, ImportChunk, Loadout,
        SchemalessImportChunk, Unit, UnitSkill, default_slot_vec, AlgoCategory,
    };

    #[test]
    fn import_test() {
        let file =
            fs::read_to_string("./schemadata.json").expect("can't open file, check perm or path");
        let res: ImportChunk = serde_json::from_str(&file).expect("unable to parse");
        println!("{:?}", res);
    }
    #[test]
    fn import_schemaless_test() {
        let file = fs::read_to_string("./schemalessdata.json")
            .expect("can't open file, check perm or path");
        let res: SchemalessImportChunk = serde_json::from_str(&file).expect("unable to parse");
        println!("{:?}", res);
    }
    #[test]
    fn add_unit_test() {
        let file =
            fs::read_to_string("./schemadata.json").expect("can't open file, check perm or path");
        let mut res: ImportChunk = serde_json::from_str(&file).expect("unable to parse");
        res.units.push(Unit {
            name: "Hubble".to_string(),
            class: Class::Sniper,
            current: Loadout {
                skill_level: Some(UnitSkill::default()),
                algo: AlgoSet {
                    offense: vec![AlgoPiece {
                        name: Algorithm::BLANK,
                        stat: AlgoMainStat::BLANK,
                        // slot: default_slot_vec(Class::Sniper, crate::model::infomodel::AlgoCategory::Offense)
                        slot: default_slot_vec(&Class::Sniper, AlgoCategory::Offense)
                    }],
                    stability: vec![AlgoPiece {
                        name: Algorithm::BLANK,
                        stat: AlgoMainStat::BLANK,
                        slot: vec![1, 2],
                    }],
                    special: vec![AlgoPiece {
                        name: Algorithm::BLANK,
                        stat: AlgoMainStat::BLANK,
                        slot: vec![1, 2],
                    }],
                },
            },
            goal: Loadout {
                skill_level: None,
                algo: AlgoSet {
                    offense: vec![AlgoPiece {
                        name: Algorithm::BLANK,
                        stat: AlgoMainStat::BLANK,
                        slot: vec![1, 2, 3],
                    }],
                    stability: vec![AlgoPiece {
                        name: Algorithm::BLANK,
                        stat: AlgoMainStat::BLANK,
                        slot: vec![1, 2, 3],
                    }],
                    special: vec![AlgoPiece {
                        name: Algorithm::BLANK,
                        stat: AlgoMainStat::BLANK,
                        slot: vec![1, 2, 3],
                    }],
                },
            },
        });
        println!("{:?}", &res);
    }

    #[test]
    fn export_test() {
        // TODO: export json from data
    }
}
