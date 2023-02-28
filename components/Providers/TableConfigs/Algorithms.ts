import { AlgoPiece } from "@/src-tauri/bindings/rspc";
import { deep_eq } from "@/utils/helper";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import { rspc } from "../ClientProviders";

const useAlgorithmConfigs = () => {
  const { data: storeData } = rspc.useQuery(["algoPiecesByLoadoutId", null]);

  const [currentPieces, setCurrentPieces] = useImmer<AlgoPiece[]>([]);
  const [dirtyPieces, setDirtyPieces] = useImmer<AlgoPiece[]>([]);

  const [piecesOnTop, setPiecesOnTop] = useImmer<AlgoPiece[]>([]);

  useEffect(() => {
    if (storeData) {
      setPiecesOnTop((draft) => {
        let beforeIds = draft.map((e) => e.id);
        let nextIds = storeData.map((e) => e.id);
        // https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
        const intersecOrDiff = nextIds.length > draft.length;
        let diff = nextIds.filter((e) =>
          intersecOrDiff ? !beforeIds.includes(e) : beforeIds.includes(e)
        );
        if (intersecOrDiff)
          storeData
            .filter((e) => diff.includes(e.id))
            .forEach((unit) => draft.push(unit));
        else draft = draft.filter((e) => diff.includes(e.id));
        // intesect > push, diff > splice
        return draft;
      });
    }
  }, [storeData]);

  useEffect(() => {
    // console.warn("dirtyskills");
    if (storeData) {
      let dirtyList = storeData.map((unit) => {
        if (dirtyPieces.map((e) => e.id).includes(unit.id))
          return dirtyPieces.find((e) => e.id == unit.id)!;
        return unit;
      });

      setPiecesOnTop((draft) => {
        draft = dirtyList;
        return draft;
      });
    }
    // console.warn(dirtySkills);
  }, [dirtyPieces]);

  function updatePiece(to: AlgoPiece, loadoutId: string) {
    if (!storeData) throw new Error("should be defined here already");

    let bucketIndex: number = dirtyPieces.findIndex((e) => e.id == to.id);

    if (bucketIndex === -1) {
      // adding
      setDirtyPieces((draft) => {
        draft.push(to);
        return draft;
      });
    } else if (
      deep_eq(storeData[storeData.findIndex((e) => e.id == to.id)], to)
    ) {
      // removing
      setDirtyPieces((draft) => {
        draft.splice(bucketIndex, 1);
        return draft;
      });
    } else {
      setDirtyPieces((draft) => {
        draft[draft.findIndex((e) => e.id == to.id)] = to;
        return draft;
      });
    }

    setCurrentPieces((draft) => {
      draft[draft.findIndex((e) => e.loadoutId == loadoutId)] = to;
      return draft;
    });
  }

  console.warn(piecesOnTop)
  return { algoPieces: piecesOnTop, dirtyPieces, currentPieces, updatePiece };
};
export default useAlgorithmConfigs;
