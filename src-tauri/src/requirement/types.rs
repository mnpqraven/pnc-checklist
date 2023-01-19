use super::impls::{AlgoPiece, Unit};

// NOTE: probably need to consider what fields are needed here
#[derive()]
pub struct AlgorithmRequirement {
    pub pieces: Vec<AlgoPiece>,
    pub from_unit: Unit
}
