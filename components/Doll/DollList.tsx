import { invoke } from "@tauri-apps/api/tauri";
import DollListItem from "./DollListItem";
import styles from "@/styles/Page.module.css";
import Image from "next/image";
import { Unit } from "@/src-tauri/bindings/structs";
import { MouseEvent, useState } from "react";
import { class_src } from "@/utils/helper";

type Props = {
  list: Unit[];
  indexHandler: (value: number) => void;
  newUnitHandler: (unit: Unit, index: number) => void;
  deleteUnitHandler: (
    index: number,
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void;
};
const DollList = ({
  list,
  indexHandler: indexChange,
  newUnitHandler,
  deleteUnitHandler,
}: Props) => {
  const [deleteMode, setDeleteMode] = useState(false);

  async function new_unit() {
    let unit: Unit = await invoke<Unit>("new_unit", {
      name: `Doll #${list.length + 1}`,
      class: "Guard",
    });
    newUnitHandler(unit, list.length);
  }

  function deleteUnit(
    index: number,
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) {
    invoke("delete_unit", { index });
    deleteUnitHandler(index, e);
  }

  return (
    <ul className={styles.dolllist}>
      <div className="flex">
        <li onClick={new_unit}>New</li>
        <li onClick={() => setDeleteMode(!deleteMode)}>Delete</li>
      </div>
      {list.map((unit, index) => (
        <li key={index} onClick={() => indexChange(index)}>
          <div className="flex items-center">
            <div className="mx-2">
              <Image
                src={class_src(unit.class)}
                alt={unit.class}
                width={24}
                height={24}
              />
            </div>
            <div>
              <DollListItem data={unit} />
              <p>
                {unit.current.skill_level?.passive}/
                {unit.current.skill_level?.auto}
              </p>
            </div>
          </div>
          {deleteMode ? (
            <>
              <button onClick={(e) => deleteUnit(index, e)}>delete</button>
            </>
          ) : (
            <></>
          )}
        </li>
      ))}
    </ul>
  );
};
export default DollList;
