use super::impls::{AlgoPiece, Unit};

// NOTE: probably need to consider what fields are needed here
#[derive()]
pub struct AlgorithmRequirement {
    pieces: Vec<AlgoPiece>,
    from_unit: Unit
}
