import { Unit } from "@/interfaces/datamodel";
import { invoke } from "@tauri-apps/api/tauri";
import { SetStateAction, useState } from "react";
import DollListItem from "./DollListItem";

type Props = {
  list: Unit[],
  indexHandler: (value: number) => void
}
const DollList = ({ list, indexHandler: indexChange }: Props) => {

  async function new_unit() {
    let unit: Unit = await invoke<Unit>('new_unit', { name: `Doll #${list.length + 1}`, class: 'Guard' });
    list.push(unit)
    indexChange(list.length - 1)
  }

  return (
    <ul>
      {list.map((unit, index) => (
        <li
          key={index}
          onClick={() => indexChange(index)}
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
