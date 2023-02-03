/* eslint-disable react-hooks/exhaustive-deps */
import { DollList, DollProfile } from "@/components/Doll";
import { StatusBar } from "@/components/Common";
import {
  AlgoErrorContext,
  AlgoErrorContextPayload,
  DollContext,
} from "@/interfaces/payloads";
import { invoke } from "@tauri-apps/api/tauri";
import { MouseEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { UnitValidationError } from "@/interfaces/results";
import { useImmer } from "use-immer";
import { Unit } from "@/src-tauri/bindings/structs";

const Dolls = () => {
  const [storeUnits, setStoreUnits] = useState<Unit[]>([]);
  const [dirtyUnits, setDirtyUnits] = useImmer<Unit[]>([]);

  // immer refactor state:
  // TODO: refactor from AlgorithmSet onwards
  const [dollData, setDollData] = useImmer<Unit | null>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const [errors, setErrors] = useState<UnitValidationError[]>([]);
  const [algoValidation, setAlgoValidation] = useState<AlgoErrorContextPayload>(
    []
  );
  const canSave = useMemo(() => {
    return JSON.stringify(dirtyUnits) != JSON.stringify(storeUnits); // shallow cmp
  }, [dirtyUnits, storeUnits]);

  async function initUnitList() {
    console.log("initUnitList");
    // NOTE: needs double await here
    // if we assign await to a variable it will be a shallow copy
    setStoreUnits(await invoke<Unit[]>("view_store_units"));
    let t = await invoke<Unit[]>("view_store_units");
    setDirtyUnits(t);
  }

  useEffect(() => {
    console.log("@[useEffect][currentIndex]");
    setDollData(dirtyUnits[currentIndex]);
  }, [currentIndex]);

  useEffect(() => {
    console.log("@[useEffect][dollData]");
    if (dollData) {
      // validateUnit(dollData);
      setDirtyUnits((draft) => {
        if (currentIndex >= 0) draft[currentIndex] = dollData;
      });
    }
  }, [dollData]);

  useEffect(() => {
    console.log("@[useEffect][]");
    initUnitList();
  }, []);

  function handleUnitSave() {
    invoke<[Unit, number][]>("save_units", {
      units: dirtyUnits.map((e, index) => [e, index]),
    });
    initUnitList(); // async
  }

  function validateUnit(e: Unit) {
    // setDollData(e);
    // TODO: implement validation
    invoke("validate", { unit: e }).catch((err) =>
      console.log(`[invoke] validate Err: ${err}`)
    );

    setDirtyUnits(
      dirtyUnits.map((unit, index) => {
        if (index === currentIndex) return e;
        else return unit;
      })
    );
  }

  function handleNewUnit(e: Unit, ind: number) {
    setDirtyUnits((draft) => {
      draft.push(e);
    });
    setCurrentIndex(ind);
  }

  function handleDeleteUnit(
    ind: number,
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) {
    e.stopPropagation();
    setCurrentIndex(ind > 0 ? ind - 1 : 0);
    setDirtyUnits((draft) => {
      draft.splice(ind, 1);
    });
  }

  return (
    <main>
      <div className="big_container">
        <div className="panel_left component_space">
          <DollList
            list={dirtyUnits}
            indexHandler={(e) => setCurrentIndex(e)}
            newUnitHandler={handleNewUnit}
            deleteUnitHandler={handleDeleteUnit}
          />
        </div>
        <div className="flex flex-grow flex-col">
          <DollContext.Provider value={{ dollData, setDollData }}>
            <AlgoErrorContext.Provider value={algoValidation}>
              <DollProfile />
            </AlgoErrorContext.Provider>
          </DollContext.Provider>
          <div className="card component_space">
            <StatusBar isSaveVisible={canSave} saveHandle={handleUnitSave} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dolls;
