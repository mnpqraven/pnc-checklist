import { DollList, DollProfile } from '@/components/Doll'
import { StatusBar } from '@/components/Common'
import { Unit } from '@/interfaces/datamodel'
import { AlgoErrorContext, AlgoErrorContextPayload, DollContext } from '@/interfaces/payloads'
import styles from '@/styles/Page.module.css'
import { invoke } from '@tauri-apps/api/tauri'
import React from 'react'
import { useEffect, useMemo, useState } from 'react'

export default function Dolls() {
  const [storeUnits, setStoreUnits] = useState<Unit[]>([]);
  const [dirtyUnits, setDirtyUnits] = useState<Unit[]>([]);

  const [dollData, setDollData] = useState<Unit | undefined>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const [algoValidation, setAlgoValidation] = useState<AlgoErrorContextPayload>([]);

  const canSave = useMemo(() => {
    return JSON.stringify(dirtyUnits) != JSON.stringify(storeUnits) // shallow cmp
  }, [dirtyUnits, storeUnits])

  async function initUnitList() {
    console.warn('initUnitList')
    // NOTE: needs double await here
    // if we assign await to a variable it will be a shallow copy
    setStoreUnits(await invoke<Unit[]>('view_store_units'))
    setDirtyUnits(await invoke<Unit[]>('view_store_units'))
  }

  // TODO: save all button
  function handleUnitSave() {
    console.warn('handleUnitSave')
    invoke<[Unit, number]>('save_unit', { unit: dirtyUnits.at(currentIndex), index: currentIndex });
    initUnitList(); // async
  }
  function handleIndex(e: number) {
    setCurrentIndex(e);
    setDollData(dirtyUnits.at(e));
  }
  function updateDirtyList(e: Unit) {
    setDollData(e)

    invoke('validate_algo', { unit: e })
      .then(_ => setAlgoValidation([]))
      .catch(err => setAlgoValidation(err as AlgoErrorContextPayload));

    setDirtyUnits(dirtyUnits.map((unit, index) => {
      if (index === currentIndex) return e;
      else return unit
    }));
  }

  useEffect(() => {
    console.log('[mount] useEffect')
    initUnitList();
  }, [])

  return (
    <>
        <div className={styles.big_container}>
          <div className={`${styles.panel_left} ${styles.component_space}`}>
          <DollList
            list={dirtyUnits}
            indexHandler={handleIndex}
          />
          </div>
          <div>
            <DollContext.Provider value={{ dollData, setDollData, updateDirtyList }}>
              <AlgoErrorContext.Provider value={algoValidation}>
                <DollProfile />
              </AlgoErrorContext.Provider>
            </DollContext.Provider>
            <StatusBar
              isSaveVisible={canSave}
              saveHandle={handleUnitSave}
            />
          </div>
        </div>
    </>
  )
}
