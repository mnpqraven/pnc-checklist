import { Algorithm, ALGOCATEGORY, AlgoCategory, AlgoPiece, AlgoTypeDb, Unit, AlgoMainStat } from "@/interfaces/datamodel"
import { DollContext } from "@/pages/dolls"
import { get_algo } from "@/utils/helper"
import { ChangeEvent, useContext, useEffect, useState } from "react"
import Select from "../Select"
import { OptionPayload } from "./AlgorithmSet"

type Props = {
  index: number
  pieceData: AlgoPiece,
  options: OptionPayload,
  category: AlgoCategory
}
const AlgorithmPiece = ({ index, pieceData, options, category }: Props) => {
  const { dollData, setDollData, updateDirtyList } = useContext(DollContext);
  const [nameLabel, setNameLabel] = useState(pieceData.name);
  const [mainStatLabel, setMainStatLabel] = useState(pieceData.stat);

  useEffect(() => {
    setNameLabel(pieceData.name);
    setMainStatLabel(pieceData.stat)
  }, [pieceData])

  function pieceHandler(event: ChangeEvent<HTMLSelectElement>) {
    if (dollData && setDollData && updateDirtyList) {
      let clone = dollData;
      get_algo(category, dollData)[index].name = event.currentTarget.value as Algorithm
      setNameLabel(event.currentTarget.value as Algorithm)
      setDollData(clone);
      updateDirtyList(dollData);
    }
  }
  function mainStatHandler(event: ChangeEvent<HTMLSelectElement>) {
    if (dollData && setDollData && updateDirtyList) {
      let clone = dollData;
      get_algo(category, dollData)[index].stat = event.currentTarget.value as AlgoMainStat
      setMainStatLabel(event.currentTarget.value as AlgoMainStat)
      setDollData(clone);
      updateDirtyList(dollData);
    }
  }

  // TODO:
  return (
    <>
      <div className="flex justify-between">
        <Select
          value={nameLabel}
          options={Object.values(options.algoTypes.algos)}
          onChangeHandler={pieceHandler}
        />
        <div>
          <Select
            value={mainStatLabel}
            options={Object.values(options.mainStat)}
            onChangeHandler={mainStatHandler}
          />
          <div>{pieceData.slot}</div>
        </div>
      </div>
    </>
  )
}
export default AlgorithmPiece