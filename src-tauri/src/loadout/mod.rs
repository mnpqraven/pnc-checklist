use std::str::FromStr;

use crate::prisma::{loadout, unit};

use self::types::LoadoutType;

mod impls;
pub mod types;

// should we accept db struct or old struct as arguments ?
pub fn get_loadout_db(
    unit: &unit::Data,
    loadout_type: LoadoutType,
) -> Option<loadout::Data> {
    unit.loadouts()
        .unwrap()
        .iter()
        .cloned()
        .find(|e| loadout_type.eq(&LoadoutType::from_str(&e.loadout_type).unwrap()))
}
