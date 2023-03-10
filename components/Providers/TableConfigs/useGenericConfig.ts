import { AlgoMainStat, AlgoPiece, Loadout, Procedures, Slot, Unit } from "@/src-tauri/bindings/rspc";
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
  Id,
} from "./configReducers";

type Extends<T, U extends T> = U;
type ArrayType<Type> = Type extends Array<infer X extends Id> ? X : never;

type PassableStructs = Extends<Id, ArrayType<Procedures['queries']['result']>>;

type Props<T extends PassableStructs> = {
  storeApi: Extract<Procedures['queries'], { result: PassableStructs[] }>['key']
  constraint: keyof T;
};

export function useGenericConfig<T extends PassableStructs>({
  storeApi,
  constraint,
}: Props<T>) {
  const { data: store } = rspc.useQuery([storeApi, null]);
  type Single = Exclude<typeof store, undefined> extends (infer R)[] ? R : never;

  const [currentList, dispatchList] = useImmerReducer<
    Single[],
    CurrentActionables<Single>
  >(currentReducer, []);

  const [dirtyOnTop, dispatchDirtyOnTop] = useImmerReducer<
    Single[],
    DirtyOnTopActionables<Single>
  >(dirtyOnTopReducer, []);

  const [dirtyList, dispatchDirtyList] = useImmerReducer<
    Single[],
    DirtyListActionables<Single>
  >(dirtyListReducer, []);

  useEffect(() => {
    if (store) {
      dispatchDirtyList({ name: "CLEAR", store: store });
      dispatchDirtyOnTop({ name: "CONFORM_WITH_STORE", store });
    }
  }, [store]);

  useEffect(() => {
    if (store) dispatchDirtyOnTop({ name: "SET", store, dirties: dirtyList });
  }, [dirtyList]);

  function updateData(to: Single, equals: string) {
    if (!store) throw new Error("should be defined here already");
    dispatchDirtyList({ name: "UPDATE", store, to });
    dispatchList({
      name: "UPDATE",
      to,
      constrain: constraint as keyof Single,
      equals
    });
  }

  return {
    data: dirtyOnTop,
    dirtyData: dirtyList,
    currentData: currentList,
    updateData,
  };
}
