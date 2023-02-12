/* eslint-disable react-hooks/exhaustive-deps */
import { DollList, DollProfile } from "@/components/Doll";
import { DollContext, SaveContext } from "@/interfaces/payloads";
import { useContext, useEffect, useMemo, useState } from "react";
import { useImmer } from "use-immer";
import { Unit } from "@/src-tauri/bindings/structs";
import { useStoreUnitsQuery } from "@/utils/hooks/dolls/useStoreUnitsQuery";
import useSaveUnitsMutation from "@/utils/hooks/mutations/saveUnits";

const Dolls = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dirtyUnits, setDirtyUnits] = useImmer<Unit[]>([]);
  const [dollData, setDollData] = useImmer<Unit>(dirtyUnits[currentIndex]);
  const storeUnitsQuery = useStoreUnitsQuery();
  const { saveUnits } = useSaveUnitsMutation();

  // NOTE: HOOKS ---------------
  const canSave = useMemo(() => {
    return JSON.stringify(dirtyUnits) != JSON.stringify(storeUnitsQuery.data);
  }, [dirtyUnits, storeUnitsQuery.data]);

  const handleSave = () => saveUnits(dirtyUnits);

  const { setUnsaved } = useContext(SaveContext);
  useEffect(() => {
    setUnsaved(canSave);
  }, [canSave]);

  useEffect(() => {
    console.warn("storeunitquery.data");
    if (storeUnitsQuery.isSuccess) {
      setDirtyUnits(storeUnitsQuery.data);
      setDollData(storeUnitsQuery.data[currentIndex]);
    }
  }, [storeUnitsQuery.data]);

  useEffect(() => {
    console.log("@[useEffect][dollData]");
    if (dollData && currentIndex >= 0)
      setDirtyUnits((draft) => {
        draft[currentIndex] = dollData;
        return draft;
      });
  }, [dollData]);

  useEffect(() => {
    setDollData(dirtyUnits[currentIndex]);
  }, [currentIndex]);

  useEffect(() => {
    if (storeUnitsQuery.data) setDollData(storeUnitsQuery.data[currentIndex]);
  }, []);

  return (
    <main>
      <DollContext.Provider
        value={{
          dollData,
          setDollData,
          storeLoading: storeUnitsQuery.isLoading,
          index: currentIndex
        }}
      >
        <div className="big_container">
          <div className="panel_left component_space">
            <DollList
              store={dirtyUnits}
              setStore={setDirtyUnits}
              indexChange={setCurrentIndex}
            />
          </div>
          <DollProfile handleSave={handleSave} canSave={canSave} />
        </div>
      </DollContext.Provider>
    </main>
  );
};

export default Dolls;
