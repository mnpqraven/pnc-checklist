import { INVOKE_KEYS } from "@/src-tauri/bindings/invoke_keys";
import { Unit } from "@/src-tauri/bindings/structs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";

const useSaveUnitsMutation = () => {
  const client = useQueryClient();

  const { mutate: saveUnits } = useMutation({
    mutationFn: (dirtyUnits: Unit[]) =>
      invoke<[Unit, number][]>(INVOKE_KEYS.SAVE_UNITS, {
        units: dirtyUnits.map((e, index) => [e, index]),
      }),
    onSettled: () => client.refetchQueries({ queryKey: [INVOKE_KEYS.VIEW_STORE_UNITS] }),
  });
  return { saveUnits };
};
export default useSaveUnitsMutation;
