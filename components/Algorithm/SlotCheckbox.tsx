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
  const [clickable, setClickable] = useState(2);

  async function setVisible(unitClass: Class, category: AlgoCategory) {
    let s = await invoke<number>('default_slot_size', { class: unitClass, category })
    setSize(s)
    setClickable(s)
  }

  useEffect(() => {
    setVisible(unitClass, category)
  }, [category, unitClass])
  // [true true true]
  // [true* true true]
  // [true* true* false]
  function updateVisible(e: ChangeEvent<HTMLInputElement>, ind: number) {
    // only applies to size of 2
    //TODO:
  }

  return (
    <>
      {value.map((item, index) => (
        <>
          <input
            key={index}
            type="checkbox"
            onChange={e => { onChangeHandler(e, index); updateVisible(e, index) }}
            checked={item}
            disabled={item === false && clickable === 0}
          />
          <span> {index + 1} </span>
        </>
      ))}
    </>
  )
}
export default SlotCheckbox
