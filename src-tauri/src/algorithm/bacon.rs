use crate::algorithm::types::{AlgoPiece, AlgoSlot, Algorithm};

#[test]
fn slots_small_to_big() {
    let right = AlgoPiece::compute_slots(&Algorithm::DeltaV, &AlgoSlot(vec![true, true]));
    assert_eq!(AlgoSlot(vec![true, true, false]), right);

    let right = AlgoPiece::compute_slots(&Algorithm::MLRMatrix, &AlgoSlot(vec![false, true]));
    assert_eq!(AlgoSlot(vec![false, true, false]), right);
}
#[test]
fn slots_big_to_small() {
    let right = AlgoPiece::compute_slots(&Algorithm::Connection, &AlgoSlot(vec![true, true, true]));
    assert_eq!(AlgoSlot(vec![true, true]), right);

    let right =
        AlgoPiece::compute_slots(&Algorithm::Inspiration, &AlgoSlot(vec![true, false, true]));
    assert_eq!(AlgoSlot(vec![true, false]), right);

    let right =
        AlgoPiece::compute_slots(&Algorithm::Feedforward, &AlgoSlot(vec![false, true, false]));
    assert_eq!(AlgoSlot(vec![false, true]), right);
}
