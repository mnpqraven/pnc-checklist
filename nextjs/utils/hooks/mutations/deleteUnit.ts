import { IVK } from "@/src-tauri/bindings/invoke_keys";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";

export const useDeleteUnitMutation = () => {
  const mutate = useMutation({
    mutationFn: (variables: { index: number }) =>
      invoke<number>(IVK.DELETE_UNIT, variables),
  });

  return mutate;
};
