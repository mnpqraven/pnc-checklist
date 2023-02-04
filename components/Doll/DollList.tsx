import { invoke } from "@tauri-apps/api/tauri";
import DollListItem from "./DollListItem";
import Image from "next/image";
import { Unit } from "@/src-tauri/bindings/structs";
import { MouseEvent, useState } from "react";
import { class_src } from "@/utils/helper";
import useNewUnitMutation from "@/utils/hooks/mutations/newUnit";
import { Updater } from "use-immer";
import useDeleteUnitMutation from "@/utils/hooks/mutations/deleteUnit";

type Props = {
  store: Unit[];
  setStore: Updater<Unit[]>;
  indexChange: (value: number) => void;
};
const DollList = ({ store, setStore, indexChange }: Props) => {
  const [deleteMode, setDeleteMode] = useState(false);
  const newUnit = useNewUnitMutation(setStore, indexChange);
  const deleteUnit = useDeleteUnitMutation(setStore, indexChange);

  return (
    <ul id="dolllist">
      <div className="flex">
        <li onClick={() => newUnit({ length: store.length })}>New</li>
        <li onClick={() => setDeleteMode(!deleteMode)}>Delete</li>
      </div>
      {store.map((unit, index) => (
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteUnit({ index });
                }}
              >
                Del
              </button>
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
