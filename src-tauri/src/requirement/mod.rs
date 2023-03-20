use self::types::*;
use crate::algorithm::types::IAlgoPiece;
use crate::service::errors::RequirementError;
use crate::state::types::Computed;
use crate::stats::types::{IUnitSkill, NeuralFragment};
use crate::unit::types::{Class, IUnit, NeuralExpansion};
use tauri::State;

#[cfg(test)]
mod bacon;
mod impls;
pub mod types;

/// calculates total tokens + pivots needed for a unit
///
/// * `current_slv`: unit's current slv
#[tauri::command]
pub fn requirement_slv(
    current_slv: IUnitSkill,
    target_slv: IUnitSkill,
) -> SkillResourceRequirement {
    SkillResourceRequirement::calculate(current_slv, target_slv)
}

#[tauri::command]
pub fn requirement_level(from: u32, to: u32) -> Result<LevelRequirement, RequirementError<u32>> {
    LevelRequirement::calculate(from, to)
}

#[tauri::command]
pub fn requirement_neural(
    current: NeuralFragment,
    from: NeuralExpansion,
    to: NeuralExpansion,
) -> Result<NeuralResourceRequirement, RequirementError<u32>> {
    NeuralResourceRequirement::calculate(current, from, to)
}

#[tauri::command]
pub fn requirment_neural_kits(
    current: NeuralFragment,
    from: NeuralExpansion,
    to: NeuralExpansion,
) -> Result<u32, RequirementError<NeuralFragment>> {
    NeuralResourceRequirement::calculate_kits_conversion(current, from, to)
}

#[tauri::command]
pub fn requirement_widget(
    class: Class,
    from: u32,
    to: u32,
) -> Result<WidgetResourceRequirement, RequirementError<u32>> {
    WidgetResourceRequirement::calculate(class, from, to)
}

#[tauri::command]
pub fn requirement_algo_unit(
    from: &IUnit,
) -> Result<AlgorithmRequirement, RequirementError<IAlgoPiece>> {
    println!("[invoke] requirement_algo");
    AlgorithmRequirement::calculate(from)
}

#[tauri::command]
pub fn requirement_algo_store(
    computed: State<Computed>,
) -> Result<Vec<AlgorithmRequirement>, RequirementError<IAlgoPiece>> {
    println!("[invoke] requirement_algo");
    let g_computed = computed.units.lock().unwrap();
    let mut v = Vec::new();
    for unit in g_computed.iter() {
        let from = unit.lock().unwrap();
        let t = AlgorithmRequirement::calculate(&from)?;
        // dbg!(&t.pieces);
        v.push(t);
    }
    Ok(v)
}

#[tauri::command]
pub fn algo_req_fulfilled(algo_req: AlgorithmRequirement) -> bool {
    algo_req.is_fulfilled()
}

#[tauri::command]
pub fn algo_req_group_piece(reqs: Vec<AlgorithmRequirement>) -> Vec<IAlgoPiece> {
    let mut pieces: Vec<IAlgoPiece> = reqs.iter().flat_map(|e| e.pieces.clone()).collect();
    let mut slate: Vec<IAlgoPiece> = Vec::new();
    for piece in pieces.iter_mut() {
        println!("{} with stat {}", piece.name, piece.stat);
        match slate
            .iter_mut()
            .find(|e| e.name == piece.name && e.stat == piece.stat)
        {
            // contains, slot increment
            Some(found_contain) => found_contain.slot.merge(piece.slot.clone()),
            // doesn't contain, push to blank slate
            _ => slate.push(piece.clone()),
        }
    }
    slate
}

#[tauri::command]
/// x axis mainStat
/// y axis algorithm
pub fn algo_req_table_piece(computed: State<'_, Computed>) -> Vec<Vec<(IAlgoPiece, IUnit)>> {
    let req_store = requirement_algo_store(computed).unwrap();
    // req {algoPiece[], Unit}[]
    let mut v: Vec<(IAlgoPiece, IUnit)> = Vec::new();
    for req in req_store.iter() {
        for piece in req.pieces.iter() {
            v.push((piece.clone(), req.from_unit.clone()));
        }
    }
    v.sort_by(|(stat1, _), (stat2, _)| {
        (stat1.name.clone() as usize).cmp(&(stat2.name.clone() as usize))
    });
    // v: (algoPiece, Unit)[]
    let t: Vec<Vec<(IAlgoPiece, IUnit)>> = v
        .group_by(|(stat1, _), (stat2, _)| stat1.name == stat2.name)
        .map(|e| e.to_owned())
        .collect();
    t
}
