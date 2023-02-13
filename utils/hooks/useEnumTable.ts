import { EnumTable } from "@/src-tauri/bindings/ENUM_TABLE";
import { IVK } from "@/src-tauri/bindings/invoke_keys";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";

export const useEnumTable = (table: EnumTable) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [IVK.ENUM_LS, table],
    queryFn: () => invoke<string[]>(IVK.ENUM_LS, { name: table }),
  });
  return { data, isLoading, isError };
};
