import { INVOKE_KEYS } from "@/src-tauri/bindings/invoke_keys";
import { Unit } from "@/src-tauri/bindings/structs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import { Updater } from "use-immer";

type InvokeParams = {
  name: string;
  class: string;
};
const DEFAULT_INVOKE_PARAMS = (length: number): InvokeParams => ({
  name: `Doll #${length + 1}`,
  class: "Guard",
});
const newUnitPostProcess = (
  invoke_res: [Unit, number],
  setStore: Updater<Unit[]>,
  setIndex: Updater<number> | ((value: number) => void)
) => {
  let [unit, index] = invoke_res;
  console.log(`New Unit: ${unit.name} created at index ${index}`);
  setStore((draft) => {
    draft.push(unit);
  });
  setIndex(index);
};

const useNewUnitMutation = (
  setStore: Updater<Unit[]>,
  setIndex: Updater<number> | ((value: number) => void)
) => {
  const client = useQueryClient();
  const { mutate: newUnit } = useMutation({
    mutationFn: (variables: { length: number; unitMetadata?: InvokeParams }) =>
      invoke<[Unit, number]>(
        INVOKE_KEYS.NEW_UNIT,
        variables.unitMetadata
          ? variables.unitMetadata
          : DEFAULT_INVOKE_PARAMS(variables.length)
      ),
    onSuccess: (data) =>
      client
        .refetchQueries({ queryKey: [INVOKE_KEYS.GET_UNITS] })
        .then(() => newUnitPostProcess(data, setStore, setIndex)),
  });

  return newUnit;
};
export default useNewUnitMutation;
