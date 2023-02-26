import { Loadout, LoadoutType } from "@/src-tauri/bindings/rspc";
import { deep_eq } from "@/utils/helper";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { rspc } from "../ClientProviders";

type Props = { unitId: string };

export const useLoadoutConfigs = ({ unitId }: Props) => {
  const { data } = rspc.useQuery(["loadoutByUnitId", unitId]);
  const [currentLoadout, setCurrentLoadout] = useImmer<Loadout | undefined>(
    undefined
  );
  const [goalLoadout, setGoalLoadout] = useImmer<Loadout | undefined>(
    undefined
  );
  const [dirtyLoadouts, setDirtyLoadouts] = useImmer<Loadout[]>([]);

  useEffect(() => {
    if (data) {
      setCurrentLoadout(data.find((e) => e.loadoutType == "Current"));
      setGoalLoadout(data.find((e) => e.loadoutType == "Goal"));
    }
  }, [data]);

  useEffect(() => {
    // TODO: refactor
    if (data) {
      let currentFind = dirtyLoadouts.find(
        (e) => e.unitId == unitId && e.loadoutType == "Current"
      )
        ? dirtyLoadouts.find(
            (e) => e.unitId == unitId && e.loadoutType == "Current"
          )
        : data.find((e) => e.loadoutType == "Current");

      let goalFind = dirtyLoadouts.find(
        (e) => e.unitId == unitId && e.loadoutType == "Goal"
      )
        ? dirtyLoadouts.find(
            (e) => e.unitId == unitId && e.loadoutType == "Goal"
          )
        : data.find((e) => e.loadoutType == "Goal");
      setCurrentLoadout(currentFind);
      setGoalLoadout(goalFind);
    }
  }, [unitId, data]);

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
