import { Unit } from "@/src-tauri/bindings/structs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";

const useSaveUnitsMutation = () => {
  const client = useQueryClient();

  const { mutate: saveUnits } = useMutation({
    mutationFn: (dirtyUnits: Unit[]) =>
      invoke<[Unit, number][]>("save_units", {
        units: dirtyUnits.map((e, index) => [e, index]),
      }),
    onSettled: () => client.refetchQueries({ queryKey: ["store_units"] }),
  });
  return { saveUnits };
};
export default useSaveUnitsMutation;
