import { Unit } from "@/src-tauri/bindings/structs";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";

export const useStoreUnitsQuery = () => {
  const storeUnitsQuery = useQuery({
    queryKey: ["store_units"],
    queryFn: () => invoke<Unit[]>("view_store_units"),
  });
  return storeUnitsQuery;
};

export const useUnitQuery = (index: number) => {
  const unitQuery = useQuery({
    queryKey: ["unit", index],
    queryFn: () => invoke<Unit>("get_unit", { index }),
  });
  return unitQuery;
};
