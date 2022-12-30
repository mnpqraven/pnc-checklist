import { Unit } from "@/interfaces/datamodel";
import { invoke } from "@tauri-apps/api/tauri";
import DollListItem from "./DollListItem";
import styles from "../../app/page.module.css";

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
    <ul className={styles.dolllist}>
      {list.map((unit, index) => (
        <li
          key={index}
          onClick={() => indexChange(index)}
        >
          <DollListItem data={unit} />
          <p>{unit.current.skill_level?.passive}/{unit.current.skill_level?.auto}</p>
        </li>
      ))}
      <li
        onClick={new_unit}
      >add new doll</li>
    </ul>
  )
}
export default DollList;
