import { Algorithm, ALGOCATEGORY, AlgoCategory, AlgoPiece, AlgoTypeDb, Unit, AlgoMainStat } from "@/interfaces/datamodel"
import { DollContext } from "@/pages/dolls"
import { get_algo } from "@/utils/helper"
import { ChangeEvent, useContext, useEffect, useState } from "react"
import { Loading, Select } from "@/components/Common"
import { OptionPayload } from "./AlgorithmSet"
import SlotCheckbox from "./SlotCheckbox"

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
  const [slot, setSlot] = useState<boolean[]>([false, false])

  useEffect(() => {
    setNameLabel(pieceData.name);
    setMainStatLabel(pieceData.stat)
    setSlot(pieceData.slot)
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
  function slotHandler(e: ChangeEvent<HTMLInputElement>, checkboxIndex: number) {
    if (dollData && setDollData && updateDirtyList) {
      let cloneProfile = dollData
      let cloneSlot = get_algo(category, cloneProfile)[index].slot
      cloneSlot[checkboxIndex] = e.target.checked
      setSlot(cloneSlot)
      setDollData(cloneProfile)
      updateDirtyList(dollData)
    }
  }

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
          {dollData ?
            <SlotCheckbox
              value={slot}
              unitClass={dollData.class}
              category={category}
              onChangeHandler={slotHandler}
            />
            : <Loading />
          }
        </div>
      </div>
    </>
  )
}
export default AlgorithmPiece
