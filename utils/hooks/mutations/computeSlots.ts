import { Algorithm } from "@/src-tauri/bindings/enums"
import { IVK } from "@/src-tauri/bindings/invoke_keys"
import { AlgoSlot } from "@/src-tauri/bindings/structs"
import { useMutation } from "@tanstack/react-query"
import { invoke } from "@tauri-apps/api/tauri"

type Payload = {
  name: Algorithm;
  currentSlots: AlgoSlot
}
export const useComputeSlotsMutation = () => {
  const computeSlotsMutation = useMutation({
    mutationKey: [IVK.ALGO_SLOTS_COMPUTE],
    mutationFn: (payload: Payload) => invoke<AlgoSlot>(IVK.ALGO_SLOTS_COMPUTE, payload),
  })
  return computeSlotsMutation
}