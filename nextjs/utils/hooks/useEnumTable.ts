import { EnumTable } from "@/src-tauri/bindings/ENUM_TABLE";
import { IVK } from "@/src-tauri/bindings/invoke_keys";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";

export const useEnumTable = <T>(table: EnumTable) => {
  const enumIter = useQuery({
    queryKey: [IVK.ENUM_LS, table],
    queryFn: () => invoke<T[]>(IVK.ENUM_LS, { name: table }),
  });
  return enumIter;
};
