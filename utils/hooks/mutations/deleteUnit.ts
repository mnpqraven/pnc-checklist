import { IVK } from "@/src-tauri/bindings/invoke_keys";
import { Unit } from "@/src-tauri/bindings/structs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import { Updater } from "use-immer";

const deleteUnitPostProcess = (
  setStore: Updater<Unit[]>,
  setIndex: Updater<number> | ((index: number) => void),
  ind: number
) => {
  setIndex(ind);
  setStore((draft) => {
    draft.splice(ind, 1);
  });
};

export const useDeleteUnitMutation = (
  setStore: Updater<Unit[]>,
  setIndex: Updater<number> | ((index: number) => void)
) => {
  const client = useQueryClient();
  const { mutate: deleteUnit } = useMutation({
    mutationFn: (variables: { index: number }) =>
      invoke<number>(IVK.DELETE_UNIT, variables),
    onSuccess: (data) =>
      client
        .refetchQueries({ queryKey: [IVK.GET_UNITS] })
        .then(() => deleteUnitPostProcess(setStore, setIndex, data)),
  });

  return deleteUnit;
};
