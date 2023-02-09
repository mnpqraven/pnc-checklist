import DollListItem from "./DollListItem";
import { Unit } from "@/src-tauri/bindings/structs";
import { useContext, useState } from "react";
import useNewUnitMutation from "@/utils/hooks/mutations/newUnit";
import { Updater, useImmer } from "use-immer";
import { useDeleteUnitMutation } from "@/utils/hooks/mutations/deleteUnit";
import Skeleton from "react-loading-skeleton";
import { DollContext } from "@/interfaces/payloads";
import { AnimatePresence, motion } from "framer-motion";
import ClassFilter from "../RadixSelect";
import { Class } from "@/src-tauri/bindings/enums";

type Props = {
  store: Unit[];
  setStore: Updater<Unit[]>;
  indexChange: (value: number) => void;
};
const DEFAULT_CLASSES: Class[] = [
  "Guard",
  "Medic",
  "Warrior",
  "Specialist",
  "Sniper",
];
const DollList = ({ store: fullStore, setStore, indexChange }: Props) => {
  const [deleteMode, setDeleteMode] = useState(false);
  const newUnit = useNewUnitMutation(setStore, indexChange);
  const { storeLoading } = useContext(DollContext);
  const deleteUnit = useDeleteUnitMutation(setStore, indexChange);

  const [filterList, setFilterList] = useImmer(DEFAULT_CLASSES);

  function filterStore(to: Class) {
    if (filterList.includes(to))
      setFilterList((draft) => {
        draft.splice(draft.indexOf(to), 1);
        return draft;
      });
    else
      setFilterList((draft) => {
        draft.push(to);
        return draft;
      });
  }

  const store = fullStore.filter((unit) => filterList.includes(unit.class));

  return (
    <ul id="dolllist" className="w-60">
      <ClassFilter onFilter={filterStore} />
      <div className="flex text-center [&>li]:grow">
        <li onClick={() => newUnit({ length: store.length })}>New</li>
        <li onClick={() => setDeleteMode(!deleteMode)}>Delete</li>
      </div>
      {storeLoading ? (
        [1, 2, 3].map((ind) => (
          <li key={ind}>
            <Skeleton count={2} />
          </li>
        ))
      ) : (
        <AnimatePresence mode="popLayout">
          {store.map((unit, index) => (
            <motion.li
              key={index}
              onClick={() => indexChange(index)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DollListItem
                unit={unit}
                deleteMode={deleteMode}
                deleteUnit={() => deleteUnit({ index: index })}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      )}
    </ul>
  );
};
export default DollList;
