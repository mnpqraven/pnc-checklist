import { DbDollContext } from "@/interfaces/payloads";
import { Loadout, LoadoutType } from "@/src-tauri/bindings/rspc";
import { deep_eq } from "@/utils/helper";
import { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import { rspc } from "../ClientProviders";
import { useStoreConfigs } from "./Units";

export const useLoadoutConfigs = (unitId: string) => {
  // if (!unitId) throw new Error('should always have an unitid')
  // unitId is undefined on refresh, need to have a fallbackId

  const { data } = rspc.useQuery(["loadoutByUnitId", unitId]);
  const types: LoadoutType[] = ["Current", "Goal"];
  const [currentLoadout, setCurrentLoadout] = useImmer<Loadout | undefined>(
    undefined
  );
  const [goalLoadout, setGoalLoadout] = useImmer<Loadout | undefined>(
    undefined
  );
  const [dirtyLoadouts, setDirtyLoadouts] = useImmer<Loadout[]>([]);

  useEffect(() => {
    // whenever unitId is changed or new db data is fetched, check first if
    // there's exsting dirty data and use it
    if (data)
      [setCurrentLoadout, setGoalLoadout].forEach((setLoadout, index) =>
        setLoadout(
          tryFind(dirtyLoadouts, types[index])
            ? tryFind(dirtyLoadouts, types[index])
            : tryFind(data, types[index])
        )
      );
  }, [unitId, data]);

  function tryFind(inList: Loadout[], type: LoadoutType) {
    return inList.find((e) => e.unitId == unitId && e.loadoutType == type);
  }

  function updateLoadout(to: Loadout, type: LoadoutType) {
    if (!data) throw new Error("should be defined here already");

    let bucketIndex: number = dirtyLoadouts.findIndex((e) => e.id == to.id);

    if (bucketIndex === -1) {
      // adding
      setDirtyLoadouts((draft) => {
        draft.push(to);
        return draft;
      });
    } else if (deep_eq(data[data.findIndex((e) => e.id == to.id)], to)) {
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

    switch (type) {
      case "Current":
        setCurrentLoadout(to);
        break;
      case "Goal":
        setGoalLoadout(to);
        break;
    }
  }

  return { currentLoadout, goalLoadout, updateLoadout, dirtyLoadouts };
};
