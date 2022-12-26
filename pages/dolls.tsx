import { DollList, DollProfile } from '@/components/Doll'
import { StatusBar } from '@/components/Common'
import { AlgoCategory, Unit } from '@/interfaces/datamodel'
import { AlgoErrorContextPayload, DollContextPayload } from '@/interfaces/payloads'
import styles from '@/styles/Home.module.css'
import { invoke } from '@tauri-apps/api/tauri'
import React from 'react'
import { useEffect, useMemo, useState } from 'react'

export const DollContext = React.createContext<DollContextPayload>
  ({ dollData: undefined, setDollData: undefined, updateDirtyList: undefined });
export const AlgoErrorContext = React.createContext<AlgoErrorContextPayload>([]);
export default function Dolls() {
  const [storeUnits, setStoreUnits] = useState<Unit[]>([]);
  const [dirtyUnits, setDirtyUnits] = useState<Unit[]>([]);

  const [profileUnit, setProfileUnit] = useState<Unit | undefined>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const [algoValidation, setAlgoValidation] = useState<AlgoErrorContextPayload>([]);

  const canSave = useMemo(() => {
    return JSON.stringify(dirtyUnits) !== JSON.stringify(storeUnits)
  }, [dirtyUnits, storeUnits])

  async function initUnitList() {
    setStoreUnits(await invoke('view_store_units'))
    setDirtyUnits(await invoke('view_store_units'))
  }

  // TODO:
  function handleUnitSave() {
    invoke<[Unit, number]>('save_unit', { unit: dirtyUnits.at(currentIndex), index: currentIndex });
    initUnitList(); // async
  }
  function handleIndex(e: number) {
    setCurrentIndex(e);
    setProfileUnit(dirtyUnits.at(e));
  }
  function updateDirtyList(e: Unit) {
    invoke('validate_algo', { unit: e })
      .then(_ => setAlgoValidation([]))
      .catch(err => setAlgoValidation(err as AlgoErrorContextPayload))
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
      <main className={styles.main}>
        <div className='flex flex-row w-10/12 justify-center'>
          <DollList
            list={dirtyUnits}
            setList={setDirtyUnits}
            indexHandler={handleIndex}
          />
          <div className='flex flex-col w-10/12'>
            {/* using context here to pass unit object deep down the tree */}
            <DollContext.Provider value={{ dollData: profileUnit, setDollData: setProfileUnit, updateDirtyList }}>
              <AlgoErrorContext.Provider value={algoValidation}>
                <DollProfile
                  dirtyListHandler={updateDirtyList}
                />
              </AlgoErrorContext.Provider>
            </DollContext.Provider>
            <StatusBar
              isSaveVisible={canSave}
              saveHandle={handleUnitSave}
            />
          </div>
        </div>
      </main>
    </>
  )
}
