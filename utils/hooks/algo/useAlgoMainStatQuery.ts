import { AlgoMainStat } from "@/src-tauri/bindings/enums";
import { IVK } from "@/src-tauri/bindings/invoke_keys";
import { AlgoPiece } from "@/src-tauri/bindings/structs";
import { useQueries, useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";

export const useAlgoMainStatQuery = () => {
  const mainStat = useQuery({
    queryKey: [IVK.MAIN_STAT_ALL],
    queryFn: () => invoke<AlgoMainStat[][]>(IVK.MAIN_STAT_ALL),
  });

  return mainStat;
};

// TODO: naming schemes
export const useSingleMainStatQuery = (pieces: AlgoPiece[]) => {
  const mainStat = useQueries({
    queries: pieces.map((piece) => {
      return {
        queryKey: ["print_main_stat", piece.slot],
        queryFn: () =>
          invoke<string>("dev_print_single_main", { payload: piece.stat }),
      };
    }),
  });
  return mainStat
};
