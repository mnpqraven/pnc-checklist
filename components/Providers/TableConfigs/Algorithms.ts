import { AlgoPiece } from "@/src-tauri/bindings/rspc";
import { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import { rspc } from "../ClientProviders";
import {
  CurrentActionables,
  currentReducer,
  DirtyListActionables,
  dirtyListReducer,
  DirtyOnTopActionables,
  dirtyOnTopReducer,
} from "./configReducers";

const useAlgorithmConfigs = () => {
  const { data: store } = rspc.useQuery(["algoPiecesByLoadoutId", null]);

  const [currentList, dispatchList] = useImmerReducer<
    AlgoPiece[],
    CurrentActionables<AlgoPiece, "loadoutId">
  >(currentReducer, []);
  const [dirtyOnTop, dispatchDirtyOnTop] = useImmerReducer<
    AlgoPiece[],
    DirtyOnTopActionables<AlgoPiece>
  >(dirtyOnTopReducer, []);
  const [dirtyList, dispatchDirtyList] = useImmerReducer<
    AlgoPiece[],
    DirtyListActionables<AlgoPiece>
  >(dirtyListReducer, []);

  useEffect(() => {
    if (store) {
      dispatchDirtyList({ name: "CLEAR", store });
      dispatchDirtyOnTop({ name: "CONFORM_WITH_STORE", store });
    }
  }, [store]);

  useEffect(() => {
    if (store) dispatchDirtyOnTop({ name: "SET", store, dirties: dirtyList });
  }, [dirtyList]);

  function updatePiece(to: AlgoPiece, loadoutId: string) {
    if (!store) throw new Error("should be defined here already");
    dispatchDirtyList({ name: "UPDATE", store, to });
    dispatchList({
      name: "UPDATE",
      to,
      constrain: "loadoutId",
      equals: loadoutId,
    });
  }

  return {
    algoPieces: dirtyOnTop,
    dirtyPieces: dirtyList,
    currentPieces: currentList,
    updatePiece,
  };
};
export default useAlgorithmConfigs;
