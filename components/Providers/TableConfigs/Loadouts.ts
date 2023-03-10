import { Loadout, LoadoutType } from "@/src-tauri/bindings/rspc";
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

export const useLoadoutConfigs = () => {
  const { data: store } = rspc.useQuery(["loadoutByUnitId", null]);

  const [currentList, dispatchList] = useImmerReducer<
    Loadout[],
    CurrentActionables<Loadout, "loadoutType">
  >(currentReducer, []);
  const [dirtyOnTop, dispatchDirtyOnTop] = useImmerReducer<
    Loadout[],
    DirtyOnTopActionables<Loadout>
  >(dirtyOnTopReducer, []);
  const [dirtyList, dispatchDirtyList] = useImmerReducer<
    Loadout[],
    DirtyListActionables<Loadout>
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

  function updateLoadout(to: Loadout, type: LoadoutType) {
    if (!store) throw new Error("should be defined here already");
    dispatchDirtyList({ name: "UPDATE", store, to });
    dispatchList({
      name: "UPDATE",
      to,
      constrain: "loadoutType",
      equals: type,
    });
  }

  return {
    loadouts: dirtyOnTop,
    dirtyLoadouts: dirtyList,
    currentLoadouts: currentList,
    updateLoadout,
  };
};
