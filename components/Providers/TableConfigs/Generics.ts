import { deep_eq } from "@/utils/helper";
import { Updater } from "use-immer";

export function clearDirty<T extends { id: string }>(
  storeData: Array<T>,
  dirtyData: Array<T>,
  dirtyUpdater: Updater<Array<T>>
) {
  let excludeIds: string[] = [];
  dirtyData.forEach((dirty) => {
    let find = storeData.find((e) => e.id == dirty.id);
    if (find && deep_eq(find, dirty)) {
      excludeIds.push(dirty.id);
    }
  });
  dirtyUpdater(dirtyData.filter((e) => !excludeIds.includes(e.id)));
}
