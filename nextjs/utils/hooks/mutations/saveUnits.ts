import { IVK } from "@/src-tauri/bindings/invoke_keys";
import { Unit } from "@/src-tauri/bindings/structs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";

const useSaveUnitsMutation = () => {
  const client = useQueryClient();

  const { mutate: saveUnits } = useMutation({
    mutationFn: (dirtyUnits: Unit[]) =>
      invoke<[Unit, number][]>(IVK.SAVE_UNITS, {
        units: dirtyUnits.map((e, index) => [e, index]),
      }),
    onSettled: () => client.refetchQueries({ queryKey: [IVK.GET_UNITS] }),
  });
  return { saveUnits };
};
export default useSaveUnitsMutation;
