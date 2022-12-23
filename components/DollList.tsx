import { Unit } from "@/interfaces";
import { invoke } from "@tauri-apps/api/tauri";
import { Dispatch, SetStateAction, useState } from "react";
import DollListItem from "./DollListItem";

type Props = {
  list: Unit[],
  setList: Dispatch<SetStateAction<Unit[]>>,
  setSelected: Dispatch<SetStateAction<Unit | undefined>>,
  setListIndex: Dispatch<SetStateAction<number>>
}
const DollList = ({ list, setList, setSelected, setListIndex }: Props) => {
  function new_unit() {
    invoke<Unit>('new_unit', { name: `Doll #${list.length + 1}`, class: 'Guard' })
      .then(unit => {
        setList(current => [...current, unit]);
        setSelected(unit);
      });
  }
  function handleChange(unit: Unit, index: number) {
    setSelected(unit)
    setListIndex(index)
  }

  return (
    <ul>
      {list.map((unit, index) => (
        <li key={index}
          onClick={() => handleChange(unit, index)}
        >
          <DollListItem data={unit} />
        </li>
      ))}
      <li
        onClick={new_unit}
      >add new doll</li>
    </ul>
  )
}
export default DollList;
