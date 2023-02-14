import { IVK } from "@/src-tauri/bindings/invoke_keys";
import { Unit } from "@/src-tauri/bindings/structs";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";

type InvokeParams = {
  name: string;
  class: string;
};
const DEFAULT_INVOKE_PARAMS = (length: number): InvokeParams => ({
  name: `Doll #${length + 1}`,
  class: "Guard",
});

const useNewUnitMutation = () => {
  const mutate = useMutation({
    mutationFn: (variables: { length: number; unitMetadata?: InvokeParams }) =>
      invoke<[Unit, number]>(
        IVK.NEW_UNIT,
        variables.unitMetadata
          ? variables.unitMetadata
          : DEFAULT_INVOKE_PARAMS(variables.length)
      ),
  });

  return mutate;
};
export default useNewUnitMutation;
