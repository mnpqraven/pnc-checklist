    use crate::model::structs::*;

    #[test]
    fn slots_small_to_big() {
        let right = AlgoPiece::compute_slots(Algorithm::DeltaV, vec![true, true]);
        assert_eq!(vec![true, true, false], right);

        let right = AlgoPiece::compute_slots(Algorithm::MLRMatrix, vec![false, true]);
        assert_eq!(vec![false, true, false], right);
    }
    #[test]
    fn slots_big_to_small() {
        let right = AlgoPiece::compute_slots(Algorithm::Connection, vec![true, true, true]);
        assert_eq!(vec![true, true], right);

        let right = AlgoPiece::compute_slots(Algorithm::Inspiration, vec![true, false, true]);
        assert_eq!(vec![true, false], right);

        let right = AlgoPiece::compute_slots(Algorithm::Feedforward, vec![false, true, false]);
        assert_eq!(vec![false, true], right);
    }
