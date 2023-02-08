import { AlgoCategory, LoadoutType } from "@/src-tauri/bindings/enums";
import { INVOKE_KEYS } from "@/src-tauri/bindings/invoke_keys";
import { AlgoPiece } from "@/src-tauri/bindings/structs";
import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";

type InvokeParam = {
  category: AlgoCategory;
  checkedSlots: boolean;
};
export const useNewAlgoMutation = (
  onSuccessHandler: (
    value: AlgoPiece,
    category: AlgoCategory,
    loadout_type: LoadoutType
  ) => void,
  category: AlgoCategory,
  loadoud_type: LoadoutType
) => {
  const { mutate: newAlgorithmPiece, data: received } = useMutation({
    mutationFn: (payload: InvokeParam) =>
      invoke<AlgoPiece>(INVOKE_KEYS.ALGO_PIECE_NEW, payload),
    onSuccess: (data) => onSuccessHandler(data, category, loadoud_type),
  });
  return { newAlgorithmPiece, received };
};
