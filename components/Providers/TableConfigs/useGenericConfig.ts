import { Procedures } from "@/src-tauri/bindings/rspc";
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

export type PassableStructs = Extends<
  Id,
  ArrayType<Procedures["queries"]["result"]>
>;

type Props<T extends PassableStructs> = {
  storeApi: Extract<
    Procedures["queries"],
    { result: PassableStructs[] }
  >["key"];
  constraint: keyof T;
};

interface Ret<RetT> {
  data: RetT[];
  dirtyData: RetT[];
  currentData: RetT[];
  updateData: (to: RetT, equals: string) => void;
}
export function useGenericConfig<T extends PassableStructs>({
  storeApi,
  constraint,
}: Props<T>): Ret<T> {
  const { data: store } = rspc.useQuery([storeApi, null]);
  // TODO: test after finish refactoring
  // type Single = Exclude<typeof store, undefined> extends (infer R)[]
  //   ? R
  //   : never;

  const [currentList, dispatchList] = useImmerReducer<
    T[],
    CurrentActionables<T>
  >(currentReducer, []);

  const [dirtyOnTop, dispatchDirtyOnTop] = useImmerReducer<
    T[],
    DirtyOnTopActionables<T>
  >(dirtyOnTopReducer, []);

  const [dirtyList, dispatchDirtyList] = useImmerReducer<
    T[],
    DirtyListActionables<T>
  >(dirtyListReducer, []);

  useEffect(() => {
    if (store) {
      dispatchDirtyList({ name: "CLEAR", store: store as T[] });
      dispatchDirtyOnTop({ name: "CONFORM_WITH_STORE", store: store as T[] });
    }
  }, [store]);

  useEffect(() => {
    if (store)
      dispatchDirtyOnTop({
        name: "SET",
        store: store as T[],
        dirties: dirtyList,
      });
  }, [dirtyList]);

  function updateData(to: T, equals: string) {
    if (!store) throw new Error("should be defined here already");
    dispatchDirtyList({ name: "UPDATE", store: store as T[], to });
    dispatchList({
      name: "UPDATE",
      to,
      constraint,
      equals,
    });
  }

  let ret: Ret<T> = {
    data: dirtyOnTop,
    dirtyData: dirtyList,
    currentData: currentList,
    updateData,
  };
  return ret;
}
