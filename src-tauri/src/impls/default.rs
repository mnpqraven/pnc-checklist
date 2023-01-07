use crate::model::structs::{UnitSkill, Level, NeuralExpansion};

impl Default for NeuralExpansion {
    fn default() -> Self {
        Self::Two
    }
}
impl Default for UnitSkill {
    fn default() -> Self {
        Self {
            passive: 1,
            auto: 1,
        }
    }
}
impl Default for Level {
    fn default() -> Self {
        Self(1)
    }
}
