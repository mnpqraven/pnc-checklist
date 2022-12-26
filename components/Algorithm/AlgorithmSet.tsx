import { AlgoCategory, ALGOCATEGORY, AlgoMainStat, AlgoSet, AlgoTypeDb } from "@/interfaces/datamodel"
import { AlgoError } from "@/interfaces/payloads"
import { AlgoErrorContext } from "@/pages/dolls"
import { invoke } from "@tauri-apps/api"
import { useState, useEffect, Suspense, useContext } from "react"
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

  const algoError: AlgoError[] = useContext(AlgoErrorContext)
  const valid = (category: AlgoCategory): number[] => {
    console.log(algoError)
    let find = algoError.find(e => e[0] == category);
    // console.log(find)
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
                  valid={!valid(ALGOCATEGORY.Offense).includes(index)}
                />
              )) : <Loading />}
          </div>
          <p>+</p>
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
                valid={!valid(ALGOCATEGORY.Stability).includes(index)}
              />
            )) : <Loading />}
          </div>
          <p>+</p>
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
                valid={!valid(ALGOCATEGORY.Special).includes(index)}
              />
            )) : <Loading />}
          </div>
          <p>+</p>
        </div>
      </div>
    </>
  )
}
export default AlgoSet