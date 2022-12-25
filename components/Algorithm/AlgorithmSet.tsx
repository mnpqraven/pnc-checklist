import { ALGOCATEGORY, AlgoMainStat, AlgoSet, AlgoTypeDb } from "@/interfaces/datamodel"
import { invoke } from "@tauri-apps/api"
import { useState, useEffect, Suspense } from "react"
import Loading from "../Loading"
import AlgorithmPiece from "./AlgorithmPiece"

type Props = {
  algo: AlgoSet
}
export type OptionPayload = {
  algoTypes: AlgoTypeDb,
  mainStat: AlgoMainStat[]
}
const AlgoSet = ({ algo }: Props) => {
  const [algoTypes, setAlgoTypes] = useState<AlgoTypeDb[]>([])
  const [mainStat, setMainStat] = useState<AlgoMainStat[]>([])

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
          <div className="border border-red-500">
            {algoTypes[0] !== undefined ?
              algo.offense.map((piece, index) => (
                <AlgorithmPiece
                  key={index}
                  index={index}
                  options={{ algoTypes: algoTypes[0], mainStat }}
                  category={ALGOCATEGORY.Offense}
                  pieceData={piece} />
              )) : <Loading />}
          </div>
          <p>+</p>
        </div>
        <div className="flex grow flex-col justify-between">
          <div className="border border-red-500">
            {algoTypes[1] !== undefined ? algo.stability.map((piece, index) => (
              <AlgorithmPiece
                key={index}
                index={index}
                options={{ algoTypes: algoTypes[1], mainStat }}
                category={ALGOCATEGORY.Stability}
                pieceData={piece} />
            )) : <Loading />}
          </div>
          <p>+</p>
        </div>
        <div className="flex grow flex-col justify-between">
          <div className="border border-red-500">
            {algoTypes[2] !== undefined ? algo.special.map((piece, index) => (
              <AlgorithmPiece
                key={index}
                index={index}
                options={{ algoTypes: algoTypes[2], mainStat }}
                category={ALGOCATEGORY.Special}
                pieceData={piece} />
            )) : <Loading />}
          </div>
          <p>+</p>
        </div>
      </div>
    </>
  )
}
export default AlgoSet