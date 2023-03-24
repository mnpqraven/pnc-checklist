use std::str::FromStr;

use prisma_client_rust::QueryError;

use crate::{
    prisma::{loadout, unit},
    service::db::get_db,
};

use self::types::LoadoutType;

mod impls;
pub mod types;

// should we accept db struct or old struct as arguments ?
pub fn get_loadout_db(unit: &unit::Data, loadout_type: LoadoutType) -> Option<loadout::Data> {
    unit.loadouts()
        .unwrap()
        .iter()
        .cloned()
        .find(|e| loadout_type.eq(&LoadoutType::from_str(&e.loadout_type).unwrap()))
}

pub async fn get_loadout_tuple(
    unit_id: String,
) -> Result<(loadout::Data, loadout::Data), QueryError> {
    let client = get_db().await;
    let loadouts = client
        .loadout()
        .find_many(vec![loadout::unit_id::equals(unit_id.clone())])
        .with(loadout::skill_level::fetch())
        .with(loadout::algo::fetch(vec![]))
        .exec()
        .await?;
    let current = loadouts
        .iter()
        .cloned()
        .find(|e| e.loadout_type.eq(&LoadoutType::Current.to_string()))
        .expect("any unit should have a current loadout");
    let goal = loadouts
        .into_iter()
        .find(|e| e.loadout_type.eq(&LoadoutType::Goal.to_string()))
        .expect("any unit should have a goal loadout");
    Ok((current, goal))
}
