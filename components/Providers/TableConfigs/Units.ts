import { Unit } from "@/src-tauri/bindings/rspc";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { rspc } from "../ClientProviders";

export const useStoreConfigs = () => {
  const { data: storeData } = rspc.useQuery(["getUnits"]);
  const [currentUnitId, setCurrentUnitId] = useState<string>(
    storeData ? storeData[0].id : ""
  );
  const [currentUnit, setCurrentUnit] = useImmer<Unit | undefined>(undefined);
  const [dirtyUnits, setDirtyUnits] = useImmer<Unit[]>([]);
  const [dirtyOnTop, setDirtyOnTop] = useImmer<Unit[]>([]);

  useEffect(() => {
    if (storeData) {
      // updates dirtyOnTop with storeData
      setDirtyOnTop((draft) => {
        let beforeIds = dirtyOnTop.map((e) => e.id);
        let nextIds = storeData.map((e) => e.id);
        // https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
        const intersecOrDiff = nextIds.length > dirtyOnTop.length;
        let diff = nextIds.filter((e) =>
          intersecOrDiff ? !beforeIds.includes(e) : beforeIds.includes(e)
        );
        if (intersecOrDiff)
          storeData
            .filter((e) => diff.includes(e.id))
            .forEach((unit) => draft.push(unit));
        else draft = draft.filter(e => diff.includes(e.id))
        // intesect > push, diff > splice
        return draft;
      });
    }
  }, [storeData]);

  useEffect(() => {
    if (storeData) {
      let dirtyList = storeData.map((unit) => {
        if (dirtyUnits.map((e) => e.id).includes(unit.id))
          return dirtyUnits.find((e) => e.id == unit.id)!;
        return unit;
      });

      setDirtyOnTop((draft) => {
        draft = dirtyList;
        return draft;
      });
    }
  }, [dirtyUnits]);

  useEffect(() => {
    if (storeData) {
      let find = dirtyUnits.find((e) => e.id == currentUnitId)
        ? dirtyUnits.find((e) => e.id == currentUnitId)
        : storeData.find((e) => e.id == currentUnitId);
      setCurrentUnit(find);
    }
  }, [currentUnitId]);

  /// appends to the dirty bucket if needed
  /// also removes from the bucket if the contents after change is the same
  function updateCurrentUnit(to: Unit) {
    // not in bucket
    let bucketIndex: number = dirtyUnits.findIndex((e) => e.id == to.id);
    if (bucketIndex === -1) {
      // adding
      setDirtyUnits((draft) => {
        draft.push(to);
        return draft;
      });
    } else if (
      storeData &&
      JSON.stringify(storeData[storeData.findIndex((e) => e.id == to.id)]) ===
        JSON.stringify(to)
    ) {
      // removing
      setDirtyUnits((draft) => {
        draft.splice(bucketIndex, 1);
        return draft;
      });
    } else {
      // stay dirty, update dirty entry
      setDirtyUnits((draft) => {
        draft[draft.findIndex((e) => e.id == to.id)] = to;
        return draft;
      });
    }
    setCurrentUnit(to);
  }

  function updateCurrentUnitId(to: string) {
    setCurrentUnitId(to);
  }

  console.warn("from context file");
  console.warn(dirtyOnTop);
  return {
    currentUnit,
    updateCurrentUnit,
    currentUnitId,
    updateCurrentUnitId,
    units: dirtyOnTop,
    dirtyUnits,
  };
};
