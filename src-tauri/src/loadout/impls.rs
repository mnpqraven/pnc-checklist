use super::types::LoadoutType;
use crate::{
    algorithm::types::*, prisma::loadout, service::db::get_db, stats::types::*, traits::FromAsync,
    unit::types::*, requirement::types::PrismaData,
};
use std::str::FromStr;

impl ILoadout {
    pub fn new(maxed_slv: bool, checked_slots: bool) -> Self {
        let skill_level = match maxed_slv {
            true => IUnitSkill::max(),
            false => IUnitSkill::default(),
        };
        Self {
            skill_level,
            algo: IAlgoSet::new(checked_slots),
            level: ILevel(1),
            neural: NeuralExpansion::Three,
            frags: NeuralFragment::default(),
            loadout_type: LoadoutType::Current,
        }
    }

    pub fn new_goal() -> Self {
        Self {
            skill_level: IUnitSkill::max(),
            level: ILevel::max(),
            algo: IAlgoSet::new(true),
            neural: NeuralExpansion::Five,
            frags: NeuralFragment(None),
            loadout_type: LoadoutType::Goal,
        }
    }

    pub fn get_algos(&self) -> Vec<&IAlgoPiece> {
        self.algo
            .offense
            .iter()
            .chain(self.algo.stability.iter())
            .chain(self.algo.special.iter())
            .collect::<Vec<&IAlgoPiece>>()
    }
}

impl FromAsync<loadout::Data> for ILoadout {
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
                .map(|piece| async { IAlgoPiece::from_async(piece.clone()).await }),
        )
        .await;
        Self {
            skill_level: IUnitSkill::from_async(value.skill_level().unwrap().unwrap().clone()).await,
            level: ILevel::new(value.level.try_into().unwrap()),
            algo: IAlgoSet::get_set(&t),
            neural: NeuralExpansion::from_str(&value.neural).unwrap(),
            frags: NeuralFragment::new(value.frags),
            loadout_type: LoadoutType::from_str(&value.loadout_type).unwrap(),
        }
    }
}

impl PrismaData for loadout::Data {
    async fn get_unit_id(&self) -> Option<String> {
        Some(self.unit_id.clone())
    }

    async fn get_loadout_type(&self) -> Option<LoadoutType> {
        LoadoutType::from_str(&self.loadout_type).ok()
    }
}
