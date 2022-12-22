import DollList from '@/components/DollList'
import DollProfile from '@/components/DollProfile'
import StatusBar from '@/components/StatusBar'
import { Database, ImportChunk, Unit } from '@/interfaces'
import styles from '@/styles/Home.module.css'
import { invoke } from '@tauri-apps/api/tauri'
import { useEffect, useState } from 'react'

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

  const [importDatabase, setImportDatabase] = useState<Database>();
  const [importUnits, setImportUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit | undefined>(importUnits.at(0))
  const [listIndex, setListIndex] = useState(0);
  useEffect(() => {
    invoke<ImportChunk>('import_userdata')
      .then(result => {
        setImportDatabase(result.database)
        setImportUnits(result.units)
      })
  }, [])
  function save_handler() {
    // TODO: saving unit should be done in the back end
    console.warn(selectedUnit?.name)
    console.warn(listIndex)
  }

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
              save_changes={save_handler}
            />
          </div>
        </div>
      </main>
    </>
  )
}
