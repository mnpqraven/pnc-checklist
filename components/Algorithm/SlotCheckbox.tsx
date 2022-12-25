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
  const [size, setSize] = useState(2)
  // FIX: bug, breaks when changing unit
  const [clickable, setClickable] = useState(value.filter(Boolean).length)

  async function setVisible(unitClass: Class, category: AlgoCategory) {
    let s = await invoke<number>('default_slot_size', { class: unitClass, category })
    setSize(s)
  }

  useEffect(() => {
    setVisible(unitClass, category)
  }, [category, unitClass])

  function updateVisible(e: ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.checked === true) {
      if (size == 2) {
        setClickable(clickable - 1)
        console.log(clickable)
      }
    } else {
      setClickable(clickable + 1)
      console.log(clickable)
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
