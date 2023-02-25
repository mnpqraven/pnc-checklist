import { LoadoutType } from "@/src-tauri/bindings/enums"
import { IVK } from "@/src-tauri/bindings/invoke_keys"
import { AlgoSet, Unit } from "@/src-tauri/bindings/structs"
import { useMutation } from "@tanstack/react-query"
import { invoke } from "@tauri-apps/api/tauri"
import { Updater } from "use-immer"

type AlgoFillSlotPayload = {
  allOrNone: boolean,
  input: AlgoSet
}
export const useMutateAlgoFillSlot = ({ setDollData, loadoutType
}: { setDollData: Updater<Unit>, loadoutType: LoadoutType }) => {
  const mutation = useMutation({
    mutationKey: [IVK.ALGO_SET_FILL],
    mutationFn: (invoke_payload: AlgoFillSlotPayload) => invoke<AlgoSet>(IVK.ALGO_SET_FILL, invoke_payload),
    onSuccess(data) {
      setDollData((draft) => {
        draft[loadoutType].algo = data;
        return draft;
      });
    },
  })
  return mutation
}