use crate::{requirement::impls::*, model::error::RequirementError};

#[cfg(test)]
mod bacon;
mod impls;

/// calculates total tokens + pivots needed for a unit
///
/// * `current_slv`: unit's current slv
#[tauri::command]
pub fn requirement_slv(current_slv: UnitSkill, target_slv: UnitSkill) -> SkillResourceRequirement {
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
