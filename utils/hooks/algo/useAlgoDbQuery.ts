import { AlgoCategory, Algorithm } from "@/src-tauri/bindings/rspc";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";

export type AlgoTuple = [AlgoCategory, Algorithm[]];

export const useAlgoDbQuery = () => {
  const algoDb = useQuery({
    queryKey: ["algoDb"],
    queryFn: () => invoke<AlgoTuple[]>("get_algo_db"),
  });
  return algoDb;
};
