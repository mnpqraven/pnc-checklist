import { AlgoCategory, ALGOCATEGORY, AlgoMainStat, AlgoPiece, AlgoSet, AlgoTypeDb, LoadoutType } from "@/interfaces/datamodel"
import { AlgoError, AlgoErrorContext, DollContext } from "@/interfaces/payloads"
import { get_algo } from "@/utils/helper"
import { invoke } from "@tauri-apps/api/tauri"
import { useState, useEffect, useContext } from "react"
import Loading from "../Loading"
import AlgorithmPiece from "./AlgorithmPiece"

type Props = {
  algo: AlgoSet,
  type: LoadoutType
}
export type OptionPayload = {
  algoTypes: AlgoTypeDb,
  mainStat: AlgoMainStat[]
}
const AlgorithmSet = ({ algo, type }: Props) => {
  const [algoTypes, setAlgoTypes] = useState<AlgoTypeDb[]>([])
  const [mainStat, setMainStat] = useState<AlgoMainStat[]>([])

  const algoError: AlgoError[] = useContext(AlgoErrorContext)
  const errList = (category: AlgoCategory): number[] => {
    // e: [ALGOCATEGORY, indexes[]]
    // FIX:
    let find = algoError.find(e => e[0] == category);
    if (find === undefined) return []
    return find[1]
  }

  useEffect(() => {
    async function get_algo_types() {
      setAlgoTypes(await invoke<AlgoTypeDb[]>('get_algo_types'))
      setMainStat(await invoke<AlgoMainStat[]>('main_stat_all'))
    }
    get_algo_types();
  }, [])

  return (
    <>
      <div id="container" className="flex">
        <div id="row-container" className="flex grow flex-col justify-between">
          <div>
            {algoTypes[0] !== undefined ?
              algo.offense.map((piece, index) => (
                <AlgorithmPiece
                  key={index}
                  index={index}
                  options={{ algoTypes: algoTypes[0], mainStat }}
                  category={ALGOCATEGORY.Offense}
                  pieceData={piece}
                  valid={!errList(ALGOCATEGORY.Offense).includes(index)}
                />
              )) : <Loading />}
          </div>
          <NewAlgoSet
            category={ALGOCATEGORY.Offense}
            loadout_type={type}
          />
        </div>
        <div className="flex grow flex-col justify-between">
          <div>
            {algoTypes[1] !== undefined ? algo.stability.map((piece, index) => (
              <AlgorithmPiece
                key={index}
                index={index}
                options={{ algoTypes: algoTypes[1], mainStat }}
                category={ALGOCATEGORY.Stability}
                pieceData={piece}
                valid={!errList(ALGOCATEGORY.Stability).includes(index)}
              />
            )) : <Loading />}
          </div>
          <NewAlgoSet
            category={ALGOCATEGORY.Stability}
            loadout_type={type}
          />
        </div>
        <div className="flex grow flex-col justify-between">
          <div>
            {algoTypes[2] !== undefined ? algo.special.map((piece, index) => (
              <AlgorithmPiece
                key={index}
                index={index}
                options={{ algoTypes: algoTypes[2], mainStat }}
                category={ALGOCATEGORY.Special}
                pieceData={piece}
                valid={!errList(ALGOCATEGORY.Special).includes(index)}
              />
            )) : <Loading />}
          </div>
          <NewAlgoSet
            category={ALGOCATEGORY.Special}
            loadout_type={type}
          />
        </div>
      </div>
    </>
  )
}
export default AlgorithmSet

const NewAlgoSet = ({ category, loadout_type }: { category: AlgoCategory, loadout_type: LoadoutType }) => {

  const { dollData, setDollData, updateDirtyList } = useContext(DollContext)
  const defined = dollData && setDollData && updateDirtyList
  async function new_algo_set(category: AlgoCategory, loadout_type: LoadoutType) {
    if (defined) {
      let cloned = { ...dollData }
      let t = await invoke<AlgoPiece>('algo_piece_new')
      get_algo(category, cloned, loadout_type).push(t)
      updateDirtyList(cloned)
    }
  }
  return (
    <button
      onClick={() => new_algo_set(category, loadout_type)}
    >
      + new algoset
    </button>
  )
}
