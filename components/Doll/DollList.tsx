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
import { IVK } from "@/src-tauri/bindings/invoke_keys";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  filter: Class[];
  isVisible: (obj: Unit, pat: Class[]) => boolean;
};
const DollList = ({ filter, isVisible }: Props) => {
  const [deleteMode, setDeleteMode] = useState(false);
  const { storeLoading, updateIndex, updateDirtyStore, dirtyStore } =
    useContext(DollContext);

  const client = useQueryClient();
  const newUnit = useNewUnitMutation();
  const deleteUnit = useDeleteUnitMutation();

  const afterNew = ([returned_unit, returned_ind]: [Unit, number]) => {
    client.refetchQueries({ queryKey: [IVK.GET_UNITS] }).then(() => {
      updateDirtyStore((draft) => {
        draft.push(returned_unit);
        return draft;
      });
      updateIndex(returned_ind);
    });
  };

  const afterDelete = (returned: number) => {
    client
      .refetchQueries({ queryKey: [IVK.GET_UNITS] })
      .then(() => updateIndex(returned));
  };

  return (
    <ul id="dolllist" className="w-60">
      <div className="mt-3 flex gap-2 [&>*]:grow">
        <Button
          onClick={() =>
            newUnit.mutate(
              { length: dirtyStore.length },
              { onSuccess: afterNew }
            )
          }
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
        <AnimatePresence mode="sync">
          {dirtyStore.map(
            (unit, index) =>
              isVisible(unit, filter) && (
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
                    deleteUnit={() =>
                      deleteUnit.mutate({ index }, { onSuccess: afterDelete })
                    }
                  />
                </motion.li>
              )
          )}
        </AnimatePresence>
      )}
    </ul>
  );
};
export default DollList;
