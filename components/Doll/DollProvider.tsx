import {
  DollContext,
  DollContextPayload,
  SaveContext,
} from "@/interfaces/payloads";
import { Unit } from "@/src-tauri/bindings/structs";
import { deep_eq } from "@/utils/helper";
import { useStoreUnitsQuery } from "@/utils/hooks/dolls/useStoreUnitsQuery";
import React, {
  Provider,
  ProviderProps,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useImmer } from "use-immer";

interface Props {
  children: ReactNode;
}
const DollProvider = ({ children }: Props) => {
  const storeData = useStoreUnitsQuery();
  const { setUnsaved } = useContext(SaveContext);

  const [dirtyStore, setDirtyUnits] = useImmer<Unit[]>(storeData.data || []);
  const [index, setCurrentIndex] = useImmer(0);
  const [dollData, setDollData] = useImmer<Unit>(dirtyStore[index]);

  const updateIndex = (to: number) => {
    setCurrentIndex(to);
  };

  const updateDirtyStore = (to: Unit[]) => {
    setDirtyUnits(to);
  };

  useEffect(() => {
    if (storeData.data) {
      console.warn("@[useEffect][storeUnitQuery.data]");
      setDirtyUnits(storeData.data);
      setDollData(storeData.data[index]);
    }
  }, [storeData.data]);

  useEffect(() => {
    if (dollData && index >= 0) {
      // in case we implement -1
      console.log("@[useEffect][dollData]");
      setDirtyUnits((draft) => {
        draft[index] = dollData;
        return draft;
      });
    }
  }, [dollData]);

  useEffect(() => {
    setDollData(dirtyStore[index]);
  }, [index]);

  useEffect(() => {
    const isChanged = !deep_eq(storeData.data, dirtyStore);
    if (storeData.data && dirtyStore) setUnsaved(isChanged);
  }, [dirtyStore]);

  return (
    <DollContext.Provider
      value={{
        dollData,
        setDollData,
        storeLoading: storeData.isLoading,
        index,
        updateIndex,
        dirtyStore,
        updateDirtyStore,
      }}
    >
      {children}
    </DollContext.Provider>
  );
};
export default DollProvider;
