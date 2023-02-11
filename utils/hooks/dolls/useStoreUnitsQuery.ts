import { INVOKE_KEYS } from "@/src-tauri/bindings/invoke_keys";
import { Unit } from "@/src-tauri/bindings/structs";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";

export const useStoreUnitsQuery = () => {
  const storeUnitsQuery = useQuery({
    queryKey: [INVOKE_KEYS.GET_UNITS],
    queryFn: () => invoke<Unit[]>(INVOKE_KEYS.GET_UNITS),
  });
  return storeUnitsQuery;
};

export const useUnitQuery = (index: number) => {
  const unitQuery = useQuery({
    queryKey: [INVOKE_KEYS.GET_UNIT, index],
    queryFn: () => invoke<Unit>(INVOKE_KEYS.GET_UNIT, { index }),
  });
  return unitQuery;
};
