import { AlgoCategory, Class } from "@/interfaces/datamodel";
import { invoke } from "@tauri-apps/api/tauri";
import { ChangeEvent, Dispatch, SetStateAction, use, useCallback, useEffect, useState } from "react";

type Props = {
  unitClass: Class,
  value: boolean[]
  category: AlgoCategory,
  onChangeHandler: (value: ChangeEvent<HTMLInputElement>, index: number) => void,
}
const SlotCheckbox = ({ unitClass, category, value, onChangeHandler }: Props) => {
  // gonna always 2 due to rendering at the same time as AlgorithmPiece
  const [clickable, setClickable] = useState(2) // default case for 2 falses
  const [size, setSize] = useState(2)

  async function setVisible(unitClass: Class, category: AlgoCategory): Promise<number> {
    let s = await invoke<number>('default_slot_size', { class: unitClass, category })
    setSize(s)
    return s
  }

  useEffect(() => {
    setVisible(unitClass, category)
      .then(size => setClickable(size - value.filter(Boolean).length))
  }, [category, unitClass, value])

  function updateVisible(e: ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.checked === true) {
      if (size == 2) {
        setClickable(clickable - 1)
      }
    } else {
      setClickable(clickable + 1)
    }
  }

  return (
    <div className="flex">
      {value.map((item, index) => (
        <div key={index}>
          <input
            type="checkbox"
            onChange={e => { onChangeHandler(e, index); updateVisible(e) }}
            checked={item}
            disabled={item === false && clickable == 0}
          />
          <span> {index + 1} </span>
        </div>
      ))}
    </div>
  )
}
export default SlotCheckbox
