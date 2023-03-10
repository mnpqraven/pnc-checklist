import { Unit } from "@/src-tauri/bindings/rspc";
import { isEmpty } from "@/utils/helper";
import { useEffect, useState } from "react";
import { useImmer, useImmerReducer } from "use-immer";
import { rspc } from "../ClientProviders";
import {
  DirtyOnTopActionables,
  dirtyOnTopReducer,
  dirtyListReducer,
  DirtyListActionables,
} from "./configReducers";

// TODO: refactor all these into a reducer
export const useStoreConfigs = () => {
  const { data: storeData } = rspc.useQuery(["getUnits"]);
  const [currentUnitId, setCurrentUnitId] = useState<string>(
    storeData && storeData[0] ? storeData[0].id : ""
  );
  const [currentUnit, setCurrentUnit] = useImmer<Unit | undefined>(undefined);

  const [dirtyOnTop, dispatchDirtyOnTop] = useImmerReducer<
    Unit[],
    DirtyOnTopActionables<Unit>
  >(dirtyOnTopReducer, []);
  const [dirtyList, dispatchDirtyList] = useImmerReducer<
    Unit[],
    DirtyListActionables<Unit>
  >(dirtyListReducer, []);

  useEffect(() => {
    if (storeData) {
      console.warn("store data changed");
      dispatchDirtyList({ name: "CLEAR", store: storeData });
      // updates dirtyOnTop with storeData
      dispatchDirtyOnTop({ name: "CONFORM_WITH_STORE", store: storeData });

      // sets initial currentUnitId
      // needed else loadout will use undefined on page load
      if (isEmpty(currentUnitId))
        setCurrentUnitId(storeData[0] ? storeData[0].id : "");
    }
  }, [storeData]);

  useEffect(() => {
    if (storeData) {
      dispatchDirtyOnTop({
        name: "SET",
        store: storeData,
        dirties: dirtyList,
      });
    }
    console.warn(dirtyList);
  }, [dirtyList]);

  useEffect(() => {
    if (storeData) {
      let find = dirtyList.find((e) => e.id == currentUnitId)
        ? dirtyList.find((e) => e.id == currentUnitId)
        : storeData.find((e) => e.id == currentUnitId);
      setCurrentUnit(find);
    }
  }, [currentUnitId]);

  /// appends to the dirty bucket if needed
  /// also removes from the bucket if the contents after change is the same
  function updateCurrentUnit(to: Unit) {
    if (storeData) dispatchDirtyList({ name: "UPDATE", store: storeData, to });
    else throw "storeData should not be undefined by now";
    setCurrentUnit(to);
  }

  function updateCurrentUnitId(to: string) {
    setCurrentUnitId(to);
  }

  return {
    currentUnit,
    updateCurrentUnit,
    currentUnitId,
    updateCurrentUnitId,
    units: dirtyOnTop,
    dirtyUnits: dirtyList,
  };
};
