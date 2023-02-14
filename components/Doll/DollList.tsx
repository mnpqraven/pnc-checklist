import DollListItem from "./DollListItem";
import { Unit } from "@/src-tauri/bindings/structs";
import { useContext, useState } from "react";
import useNewUnitMutation from "@/utils/hooks/mutations/newUnit";
import { useDeleteUnitMutation } from "@/utils/hooks/mutations/deleteUnit";
import Skeleton from "react-loading-skeleton";
import { DollContext } from "@/interfaces/payloads";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../Button";
import { Class } from "@/src-tauri/bindings/enums";

type Props = {
  filtered: Unit[]
}
const DollList = ({filtered: storeAfterFilter} : Props) => {
  const [deleteMode, setDeleteMode] = useState(false);
  const { storeLoading, updateIndex, updateDirtyStore, dirtyStore } =
    useContext(DollContext);

  // TODO: get rid of update index updater too
  const newUnit = useNewUnitMutation(updateIndex);
  const deleteUnit = useDeleteUnitMutation(updateIndex);

  const filterMethod = (units: Unit[], pat: Class[]) => {
    return units.filter((unit) => pat.includes(unit.class));
  };
  return (
    <ul id="dolllist" className="w-60">
      <div className="mt-3 flex gap-2 [&>*]:grow">
        <Button
          onClick={() => newUnit({ length: storeAfterFilter.length })}
          label={"New"}
        />
        <Button onClick={() => setDeleteMode(!deleteMode)}>Delete</Button>
      </div>
      {storeLoading ? (
        [1, 2, 3].map((ind) => (
          <li key={ind}>
            <Skeleton count={2} />
          </li>
        ))
      ) : (
        <AnimatePresence mode="popLayout">
          {storeAfterFilter.map((unit, index) => (
            <motion.li
              key={index}
              onClick={() => updateIndex(index)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DollListItem
                unit={unit}
                deleteMode={deleteMode}
                deleteUnit={() => deleteUnit({ index })}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      )}
    </ul>
  );
};
export default DollList;
