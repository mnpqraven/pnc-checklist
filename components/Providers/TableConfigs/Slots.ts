import { Slot } from "@/src-tauri/bindings/rspc";
import { deep_eq } from "@/utils/helper";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import { rspc } from "../ClientProviders";
import { clearDirty } from "./Generics";

const useSlotConfigs = () => {
  const { data: storeData } = rspc.useQuery(["slotsByAlgoPieceIds", null]);

  const [currentSlots, setCurrentSlots] = useImmer<Slot[]>([]);
  const [dirtySlots, setDirtySlots] = useImmer<Slot[]>([]);

  const [slotsOnTop, setSlotsOnTop] = useImmer<Slot[]>([]);

  useEffect(() => {
    if (storeData) {
      clearDirty<Slot>(storeData, dirtySlots, setDirtySlots);
      setSlotsOnTop((draft) => {
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
        if (dirtySlots.map((e) => e.id).includes(unit.id))
          return dirtySlots.find((e) => e.id == unit.id)!;
        return unit;
      });

      setSlotsOnTop((draft) => {
        draft = dirtyList;
        return draft;
      });
    }
    // console.warn(dirtySkills);
  }, [dirtySlots]);

  function updateSlot(to: Slot, algoPieceId: string) {
    if (!storeData) throw new Error("should be defined here already");

    let bucketIndex: number = dirtySlots.findIndex((e) => e.id == to.id);

    if (bucketIndex === -1) {
      // adding
      setDirtySlots((draft) => {
        draft.push(to);
        return draft;
      });
    } else if (
      deep_eq(storeData[storeData.findIndex((e) => e.id == to.id)], to)
    ) {
      // removing
      setDirtySlots((draft) => {
        draft.splice(bucketIndex, 1);
        return draft;
      });
    } else {
      setDirtySlots((draft) => {
        draft[draft.findIndex((e) => e.id == to.id)] = to;
        return draft;
      });
    }

    setCurrentSlots((draft) => {
      draft[draft.findIndex((e) => e.algoPieceId == algoPieceId)] = to;
      return draft;
    });
  }

  return { slots: slotsOnTop, dirtySlots, currentSlots, updateSlot };
};
export default useSlotConfigs;
