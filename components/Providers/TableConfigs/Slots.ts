import { Slot } from "@/src-tauri/bindings/rspc";
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

const useSlotConfigs = () => {
  const { data: store } = rspc.useQuery(["slotsByAlgoPieceIds", null]);

  const [currentList, dispatchList] = useImmerReducer<
    Slot[],
    CurrentActionables<Slot, "algoPieceId">
  >(currentReducer, []);
  const [dirtyOnTop, dispatchDirtyOnTop] = useImmerReducer<
    Slot[],
    DirtyOnTopActionables<Slot>
  >(dirtyOnTopReducer, []);
  const [dirtyList, dispatchDirtyList] = useImmerReducer<
    Slot[],
    DirtyListActionables<Slot>
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

  function updateSlot(to: Slot, algoPieceId: string) {
    if (!store) throw new Error("should be defined here already");

    dispatchDirtyList({ name: "UPDATE", store, to });
    dispatchList({
      name: "UPDATE",
      to,
      constrain: "algoPieceId",
      equals: algoPieceId,
    });
  }

  return {
    slots: dirtyOnTop,
    dirtySlots: dirtyList,
    currentSlots: currentList,
    updateSlot,
  };
};
export default useSlotConfigs;
