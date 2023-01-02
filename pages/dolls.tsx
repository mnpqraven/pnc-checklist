import { DollList, DollProfile } from "@/components/Doll";
import { StatusBar } from "@/components/Common";
import { Unit } from "@/interfaces/datamodel";
import {
  AlgoErrorContext,
  AlgoErrorContextPayload,
  DollContext,
} from "@/interfaces/payloads";
import styles from "@/styles/Page.module.css";
import { invoke } from "@tauri-apps/api/tauri";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { UnitValidationError } from "@/interfaces/results";

const Dolls = () => {
  const [storeUnits, setStoreUnits] = useState<Unit[]>([]);
  const [dirtyUnits, setDirtyUnits] = useState<Unit[]>([]);

  const [dollData, setDollData] = useState<Unit | undefined>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const [errors, setErrors] = useState<UnitValidationError[]>([]);
  const [algoValidation, setAlgoValidation] = useState<AlgoErrorContextPayload>(
    []
  );
  const [dirtyIndexTup, setDirtyIndexTup] = useState<[Unit, number][] >([]);

  const canSave = useMemo(() => {
    return JSON.stringify(dirtyUnits) != JSON.stringify(storeUnits); // shallow cmp
  }, [dirtyUnits, storeUnits]);

  async function initUnitList() {
    console.warn("initUnitList");
    // NOTE: needs double await here
    // if we assign await to a variable it will be a shallow copy
    setStoreUnits(await invoke<Unit[]>("view_store_units"));
    setDirtyUnits(await invoke<Unit[]>("view_store_units"));
  }

  useEffect(() => {
    let list: [Unit, number][] = [];
    storeUnits.map((storeItem, index) => {
      if (JSON.stringify(storeItem) != JSON.stringify(dirtyUnits[index])) {
        let p: [Unit, number] = [dirtyUnits[index], index];
        list.push(p);
      }
      return storeItem;
    });
    setDirtyIndexTup(list);
  }, [dirtyUnits, storeUnits]);

  // TODO: save all button
  function handleUnitSave() {
    console.warn("handleUnitSave");
    invoke<[[Unit, number]]>("save_units", { units: dirtyIndexTup });
    initUnitList(); // async
  }

  function handleIndex(e: number) {
    setCurrentIndex(e);
    setDollData(dirtyUnits.at(e));
  }

  function updateDirtyList(e: Unit) {
    setDollData(e);
    // TODO: implement validation
    invoke("validate", { unit: e }).catch((err) => console.log(err));

    setDirtyUnits(
      dirtyUnits.map((unit, index) => {
        if (index === currentIndex) return e;
        else return unit;
      })
    );
  }

  useEffect(() => {
    console.log("[mount] page dolls");
    initUnitList();
  }, []);

  return (
    <main>
      <div className={styles.big_container}>
        <div className={`${styles.panel_left} ${styles.component_space}`}>
          <DollList list={dirtyUnits} indexHandler={handleIndex} />
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
