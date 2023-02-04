import { AlgoMainStat } from "@/src-tauri/bindings/enums";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";

export const useAlgoMainStatQuery = () => {
  const mainStat = useQuery({
    queryKey: ["main_stat", "all"],
    queryFn: () => invoke<AlgoMainStat[][]>("main_stat_all"),
    placeholderData: [],
  });

  return mainStat;
};
