/* eslint-disable react-hooks/exhaustive-deps */
import { DollList, DollProfile } from "@/components/Doll";
import { Loading, StatusBar } from "@/components/Common";
import { AlgoErrorContext, DollContext } from "@/interfaces/payloads";
import { MouseEvent, Suspense } from "react";
import { useEffect, useMemo, useState } from "react";
import { useImmer } from "use-immer";
import { Unit } from "@/src-tauri/bindings/structs";
import { useStoreUnitsQuery } from "@/utils/hooks/dolls/useStoreUnitsQuery";
import useSaveUnitsMutation from "@/utils/hooks/mutations/saveUnits";
import useNewUnitMutation from "@/utils/hooks/mutations/newUnit";
import useDeleteUnitMutation from "@/utils/hooks/mutations/deleteUnit";

const Dolls = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [dirtyUnits, setDirtyUnits] = useImmer<Unit[]>([]);
  const [dollData, setDollData] = useImmer<Unit | undefined>(
    dirtyUnits[currentIndex]
  );
  const storeUnitsQuery = useStoreUnitsQuery();

  // TODO: not used yet
  // const [errors, setErrors] = useState<UnitValidationError[]>([]);
  // const [algoValidation, setAlgoValidation] = useState<AlgoErrorContextPayload>(
  //   []
  // );

  // NOTE: see if it's better to move this to util hooks
  // const newUnitPostProcess = (e: Unit, ind: number) => {
  //   console.log(`New Unit: ${e.name} created at index ${ind}`);
  //   setDirtyUnits((draft) => {
  //     draft.push(e);
  //   });
  //   setCurrentIndex(ind);
  // };
  // const newUnit = useNewUnitMutation(newUnitPostProcess);
  //
  const { deleteUnit } = useDeleteUnitMutation();

  function handleDeleteUnit(
    ind: number,
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) {
    deleteUnit(ind);
    e.stopPropagation();
    setCurrentIndex(ind > 0 ? ind - 1 : 0);
    setDirtyUnits((draft) => {
      draft.splice(ind, 1);
    });
  }

  // NOTE: HOOKS ---------------
  const canSave = useMemo(() => {
    return JSON.stringify(dirtyUnits) != JSON.stringify(storeUnitsQuery.data);
  }, [dirtyUnits, storeUnitsQuery.data]);

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

  if (storeUnitsQuery.isLoading) return <Loading />;
  if (storeUnitsQuery.isError) return <p>error</p>;

  return (
    <main>
      <div className="big_container">
        <div className="panel_left component_space">
          <DollList
            store={dirtyUnits}
            setStore={setDirtyUnits}
            indexChange={setCurrentIndex}
            deleteUnitHandler={handleDeleteUnit}
          />
        </div>
        <div className="flex flex-grow flex-col">
          <DollContext.Provider value={{ dollData, setDollData }}>
            <DollProfile />
            {/* <AlgoErrorContext.Provider value={[]}> */}
            {/* </AlgoErrorContext.Provider> */}
          </DollContext.Provider>
          <div className="card component_space">
            <StatusBar isSaveVisible={canSave} dirtyUnits={dirtyUnits} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dolls;
