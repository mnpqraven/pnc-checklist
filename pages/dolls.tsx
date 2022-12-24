import DollList from '@/components/Doll/DollList'
import DollProfile from '@/components/Doll/DollProfile'
import StatusBar from '@/components/StatusBar'
import { Database, ImportChunk, Unit } from '@/interfaces'
import styles from '@/styles/Home.module.css'
import { invoke } from '@tauri-apps/api/tauri'
import { useCallback, useEffect, useState } from 'react'

export default function Dolls() {
  // NOTE:
  // Layout
  // ┌─────┬─────────┐
  // │     │         │
  // │     │    B    │
  // │  A  │         │
  // │     ├─────────┤
  // │     │    C    │
  // └─────┴─────────┘
  // A: doll list
  // B: info form
  // C: save/info text

  const [importUnits, setImportUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit | undefined>(importUnits.at(0))
  const [listIndex, setListIndex] = useState(0);

  async function update_units() {
    setImportUnits(await invoke('view_store_units'))
  }

  const handleUnitSave = useCallback(() => {
    if (selectedUnit !== undefined) {
      invoke<[Unit, number]>('save_unit', { unit: selectedUnit, index: listIndex });
      update_units(); // async
    }
  }, [listIndex, selectedUnit]);

  // synchro
  useEffect(() => {
    update_units();
  }, [handleUnitSave])

  return (
    <>
      <main className={styles.main}>
        <div className='border border-red-600 flex flex-row w-10/12 justify-center'>
          <DollList
            list={importUnits}
            setList={setImportUnits}
            setSelected={setSelectedUnit}
            setListIndex={setListIndex}
          />
          <div className='border border-blue-500 flex flex-col w-10/12'>
            {/* needs to return index to parent */}
            <DollProfile
              unit={selectedUnit}
              setUnit={setSelectedUnit}
            />
            <StatusBar
              saveHandle={handleUnitSave}
            />
          </div>
        </div>
      </main>
    </>
  )
}
