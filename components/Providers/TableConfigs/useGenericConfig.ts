import { Procedures } from "@/src-tauri/bindings/rspc";
import { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import {
  CurrentActionables,
  DirtyListActionables,
  DirtyOnTopActionables,
  PassableStructs,
} from "../actionables";
import { rspc } from "../ClientProviders";
import {
  currentReducer,
  dirtyListReducer,
  dirtyOnTopReducer,
} from "./configReducers";

type Props<T extends PassableStructs> = {
  storeApi: Extract<
    Procedures["queries"],
    { result: PassableStructs[], input: never }
  >["key"];
  constraint: keyof T;
};

interface Ret<RetT> {
  data: RetT[];
  store: RetT[] | undefined;
  refetch: () => void;
  dirtyData: RetT[];
  currentData: RetT[];
  updateData: (to: RetT, equals: string) => void;
}
export function useGenericConfig<T extends PassableStructs>({
  storeApi,
  constraint,
}: Props<T>): Ret<T> {
  const { data: store, refetch } = rspc.useQuery([storeApi]);

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
      dispatchDirtyList({ name: "CLEAR", store });
      dispatchDirtyOnTop({ name: "CONFORM_WITH_STORE", store });
    }
  }, [dispatchDirtyList, dispatchDirtyOnTop, store]);

  useEffect(() => {
    if (store)
      dispatchDirtyOnTop({
        name: "SET",
        store,
        dirties: dirtyList,
      });
  }, [dirtyList, dispatchDirtyOnTop]);

  /**
   * required equal variable for each data type
   * AlgoPiece: loadoutId
   * UnitSkill: loadoutId
   * Loadout: loadoutType
   * Slot: algoPieceId
   */
  function updateData(to: T, equals: string) {
    if (!store) throw new Error("should be defined here already");
    dispatchDirtyList({ name: "UPDATE", store, to });
    dispatchList({
      name: "UPDATE",
      to,
      constraint,
      equals,
    });
  }

  let ret: Ret<T> = {
    data: dirtyOnTop,
    store: store as T[],
    refetch,
    dirtyData: dirtyList,
    currentData: currentList,
    updateData,
  };
  return ret;
}
