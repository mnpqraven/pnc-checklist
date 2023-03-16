use super::types::LoadoutType;
use crate::{
    algorithm::types::*, prisma::loadout, service::db::get_db, stats::types::*, traits::FromAsync,
    unit::types::*,
};
use std::str::FromStr;

impl Loadout {
    pub fn new(maxed_slv: bool, checked_slots: bool) -> Self {
        let skill_level = match maxed_slv {
            true => UnitSkill::max(),
            false => UnitSkill::default(),
        };
        Self {
            skill_level,
            algo: AlgoSet::new(checked_slots),
            level: Level(1),
            neural: NeuralExpansion::Three,
            frags: NeuralFragment::default(),
            loadout_type: LoadoutType::Current,
        }
    }

    pub fn new_goal() -> Self {
        Self {
            skill_level: UnitSkill::max(),
            level: Level::max(),
            algo: AlgoSet::new(true),
            neural: NeuralExpansion::Five,
            frags: NeuralFragment(None),
            loadout_type: LoadoutType::Goal,
        }
    }

    pub fn get_algos(&self) -> Vec<&AlgoPiece> {
        self.algo
            .offense
            .iter()
            .chain(self.algo.stability.iter())
            .chain(self.algo.special.iter())
            .collect::<Vec<&AlgoPiece>>()
    }
}

impl FromAsync<loadout::Data> for Loadout {
    async fn from_async(value: loadout::Data) -> Self {
        let client = get_db().await;
        let lo = client
            .loadout()
            .find_unique(loadout::id::equals(value.id.clone()))
            .with(loadout::algo::fetch(vec![]))
            .with(loadout::skill_level::fetch())
            .exec()
            .await
            .unwrap()
            .unwrap();
        let t = futures::future::join_all(
            lo.algo()
                .unwrap()
                .iter()
                .map(|piece| async { AlgoPiece::from_async(piece.clone()).await }),
        )
        .await;
        Self {
            skill_level: UnitSkill::from_async(value.skill_level().unwrap().unwrap().clone()).await,
            level: Level::new(value.level.try_into().unwrap()),
            algo: AlgoSet::get_set(&t),
            neural: NeuralExpansion::from_str(&value.neural).unwrap(),
            frags: NeuralFragment::new(value.frags),
            loadout_type: LoadoutType::from_str(&value.loadout_type).unwrap(),
        }
    }
}
