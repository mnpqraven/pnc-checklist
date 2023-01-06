use crate::{parser::requirement::NeuralExpansion, model::infomodel::{UnitSkill, Level}};

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
