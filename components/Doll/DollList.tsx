import DollListItem from "./DollListItem";
import { useContext, useState } from "react";
import useNewUnitMutation from "@/utils/hooks/mutations/newUnit";
import { useDeleteUnitMutation } from "@/utils/hooks/mutations/deleteUnit";
import Skeleton from "react-loading-skeleton";
import { DollContext } from "@/interfaces/payloads";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../Button";
import { IVK } from "@/src-tauri/bindings/invoke_keys";
import { useQueryClient } from "@tanstack/react-query";
import { rspc } from "../Toast/Providers";
import { Class, Unit } from "@/src-tauri/bindings/rspc";
import Loading from "../Loading";

type Props = {
  filter: Class[];
  isVisible: (obj: Unit, pat: Class[]) => boolean;
};
const DollList = ({ filter, isVisible }: Props) => {
  const [deleteMode, setDeleteMode] = useState(false);
  // const { storeLoading, updateIndex, updateDirtyStore, dirtyStore } =
  //   useContext(DollContext);

  const { data: dirtyStore, isLoading, isError } = rspc.useQuery(["getUnits"]);

  const client = useQueryClient();
  // const newUnit = useNewUnitMutation();
  const newUnit = rspc.useMutation(["newUnit"]);
  const deleteUnit = useDeleteUnitMutation();

  const afterNew = ([returned_unit, returned_ind]: [Unit, number]) => {
    // client.refetchQueries({ queryKey: [IVK.GET_UNITS] }).then(() => {
    //   updateDirtyStore((draft) => {
    //     draft.push(returned_unit);
    //     return draft;
    //   });
    //   updateIndex(returned_ind);
    // });
  };

  const afterDelete = (returned: number) => {
    // client
    //   .refetchQueries({ queryKey: [IVK.GET_UNITS] })
    //   .then(() => updateIndex(returned));
  };
  if (isLoading) return <Loading />;
  if (isError) throw new Error("error in dev page");

  const nextUnitName = `Doll #${dirtyStore.length + 1}`;

  return (
    <ul id="dolllist" className="w-60">
      <div className="mt-3 flex gap-2 [&>*]:grow">
        <Button
          label={"New"}
          onClick={() => {
            newUnit.mutate([nextUnitName, "Guard"]);
          }}
        />
        <Button onClick={() => setDeleteMode(!deleteMode)}>Delete</Button>
      </div>
      {isLoading ? (
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
