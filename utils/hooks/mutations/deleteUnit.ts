import { Unit } from "@/src-tauri/bindings/structs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import { Updater } from "use-immer";
import { QUERY_KEYS } from "../query_keys";

const deleteUnitPostProcess = (
  setStore: Updater<Unit[]>,
  setIndex: Updater<number> | ((index: number) => void),
  ind: number
) => {
  console.warn(ind);
  setIndex(ind);
  setStore((draft) => {
    draft.splice(ind, 1);
  });
};

const useDeleteUnitMutation = (
  setStore: Updater<Unit[]>,
  setIndex: Updater<number> | ((index: number) => void)
) => {
  const client = useQueryClient();
  const { mutate: deleteUnit } = useMutation({
    mutationFn: (variables: { index: number }) =>
      invoke<number>("delete_unit", variables),
    onSuccess: (data) =>
      client
        .refetchQueries({ queryKey: [QUERY_KEYS.STORE_UNITS] })
        .then(() => deleteUnitPostProcess(setStore, setIndex, data)),
  });

  return deleteUnit;
};
export default useDeleteUnitMutation;
