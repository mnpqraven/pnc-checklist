/* eslint-disable react-hooks/exhaustive-deps */
import { DollList, DollProfile } from "@/components/Doll";
import { StatusBar } from "@/components/Common";
import {
  AlgoErrorContext,
  AlgoErrorContextPayload,
  DollContext,
} from "@/interfaces/payloads";
import styles from "@/styles/Page.module.css";
import { invoke } from "@tauri-apps/api/tauri";
import { MouseEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { UnitValidationError } from "@/interfaces/results";
import { useImmer } from "use-immer";
import { Unit } from "@/src-tauri/bindings/structs/Unit";

const Dolls = () => {
  const [storeUnits, setStoreUnits] = useState<Unit[]>([]);
  const [dirtyUnits, setDirtyUnits] = useImmer<Unit[]>([]);

  // immer refactor state:
  // TODO: refactor from AlgorithmSet onwards
  const [dollData, setDollData] = useImmer<Unit | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [errors, setErrors] = useState<UnitValidationError[]>([]);
  const [algoValidation, setAlgoValidation] = useState<AlgoErrorContextPayload>(
    []
  );
  const [dirtyIndexTup, setDirtyIndexTup] = useImmer<[Unit, number][]>([]);

  const canSave = useMemo(() => {
    return JSON.stringify(dirtyUnits) != JSON.stringify(storeUnits); // shallow cmp
  }, [dirtyUnits, storeUnits]);

  async function initUnitList() {
    console.warn("initUnitList");
    // NOTE: needs double await here
    // if we assign await to a variable it will be a shallow copy
    setStoreUnits(await invoke<Unit[]>("view_store_units"));
    let t = await invoke<Unit[]>("view_store_units");
    setDirtyUnits(t);
  }

  useEffect(() => {
    console.log("[mount] page dolls");
    initUnitList();
  }, []);

  useEffect(() => {
    console.log("@dolls.tsx[useEffect], dollData changed");
    if (dollData) updateDirtyList(dollData);
  }, [dollData]);

  useEffect(() => {
    let list: [Unit, number][] = [];
    storeUnits.map((storeItem, index) => {
      if (JSON.stringify(storeItem) != JSON.stringify(dirtyUnits[index])) {
        let p: [Unit, number] = [dirtyUnits[index], index];
        list.push(p);
      }
      return storeItem;
    });
    // setDirtyIndexTup(list);
  }, [dirtyUnits, storeUnits]);

  useEffect(() => {
    setDollData((draft) => {
      draft = dirtyUnits[currentIndex];
      return draft;
    });
  }, [currentIndex]);

  function handleUnitSave() {
    invoke<[Unit, number][]>("save_units", { units: dirtyIndexTup });
    initUnitList(); // async
  }

  function handleIndex(ind: number) {
    setCurrentIndex(ind);
    // setDollData(dirtyUnits[e]);
  }

  function updateDirtyList(e: Unit) {
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
    setDirtyIndexTup((draft) => {
      draft.push([e, currentIndex]);
    });
  }

  function handleNewUnit(e: Unit, ind: number) {
    setDirtyUnits((draft) => {
      draft.push(e);
    });
    setDirtyIndexTup((draft) => {
      draft.push([e, ind]);
    });
    setCurrentIndex(ind);
    // setDollData(e);
  }
  function handleDeleteUnit(
    ind: number,
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) {
    e.stopPropagation();
    setDirtyUnits((draft) => {
      draft.splice(ind, 1);
    });
  }
  useEffect(() => {
    const ind = currentIndex >= dirtyUnits.length ? dirtyUnits.length - 1 : currentIndex
    setDollData(dirtyUnits[ind])
  }, [handleDeleteUnit])

  return (
    <main>
      <div className={styles.big_container}>
        <div className={`${styles.panel_left} ${styles.component_space}`}>
          <DollList
            list={dirtyUnits}
            indexHandler={handleIndex}
            newUnitHandler={handleNewUnit}
            deleteUnitHandler={handleDeleteUnit}
          />
        </div>
        <div>
          <DollContext.Provider
            value={{ dollData, setDollData, updateDirtyList }}
          >
            <AlgoErrorContext.Provider value={algoValidation}>
              <DollProfile />
            </AlgoErrorContext.Provider>
          </DollContext.Provider>
          <div className={`${styles.card} ${styles.component_space}`}>
            <StatusBar isSaveVisible={canSave} saveHandle={handleUnitSave} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dolls;
