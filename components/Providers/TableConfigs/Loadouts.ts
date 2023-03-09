import { Loadout, LoadoutType } from "@/src-tauri/bindings/rspc";
import { deep_eq } from "@/utils/helper";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import { rspc } from "../ClientProviders";
import { clearDirty } from "./Generics";

export const useLoadoutConfigs = () => {
  // if (!unitId) throw new Error('should always have an unitid')
  // unitId is undefined on refresh, need to have a fallbackId

  const { data: storeData } = rspc.useQuery(["loadoutByUnitId", null]);
  const types: LoadoutType[] = ["Current", "Goal"];

  const [usingLoadouts, setUsingLoadouts] = useImmer<Loadout[]>([]);
  const [dirtyLoadouts, setDirtyLoadouts] = useImmer<Loadout[]>([]);

  const [loadoutsOnTop, setLoadoutOnTop] = useImmer<Loadout[]>([]);

  useEffect(() => {
    if (storeData) {
      console.warn('loadout store changed')
      clearDirty<Loadout>(storeData, dirtyLoadouts, setDirtyLoadouts)
      setLoadoutOnTop((draft) => {
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
        if (dirtyLoadouts.map((e) => e.id).includes(unit.id))
          return dirtyLoadouts.find((e) => e.id == unit.id)!;
        return unit;
      });

      setLoadoutOnTop((draft) => {
        draft = dirtyList;
        return draft;
      });
    }
    // console.warn(dirtySkills);
  }, [dirtyLoadouts]);

  function updateLoadout(to: Loadout, type: LoadoutType) {
    if (!storeData) throw new Error("should be defined here already");

    let bucketIndex: number = dirtyLoadouts.findIndex((e) => e.id == to.id);

    if (bucketIndex === -1) {
      // adding
      setDirtyLoadouts((draft) => {
        draft.push(to);
        return draft;
      });
    } else if (
      deep_eq(storeData[storeData.findIndex((e) => e.id == to.id)], to)
    ) {
      // removing
      setDirtyLoadouts((draft) => {
        draft.splice(bucketIndex, 1);
        return draft;
      });
    } else {
      setDirtyLoadouts((draft) => {
        draft[draft.findIndex((e) => e.id == to.id)] = to;
        return draft;
      });
    }

    setUsingLoadouts((draft) => {
      draft[draft.findIndex((e) => e.loadoutType == type)] = to;
      return draft;
    });
  }

  return {
    loadouts: loadoutsOnTop,
    usingLoadouts,
    updateLoadout,
    dirtyLoadouts,
  };
};
