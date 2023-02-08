import { AlgoCategory, Algorithm, Day } from "@/src-tauri/bindings/enums";
import { INVOKE_KEYS } from "@/src-tauri/bindings/invoke_keys";
import { DEFAULT_DAYS } from "@/utils/defaults";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import { useAlgoDbQuery } from "./useAlgoDbQuery";

type AlgoTuple = [AlgoCategory, Algorithm[]];
export const useAlgoByDayQuery = (dayIndex: number) => {
  const client = useQueryClient();
  const day = DEFAULT_DAYS[dayIndex];
  const algoDb = useAlgoDbQuery();

  const prefetchOpt = (day: Day) => ({
    queryKey: [INVOKE_KEYS.GET_ALGO_BY_DAYS, algoDb, day],
    queryFn: () => invoke<Algorithm[]>(INVOKE_KEYS.GET_ALGO_BY_DAYS, { day }),
  });

  const algoByDays = useQuery({ ...prefetchOpt(day), enabled: !!algoDb.data });

  function processData(
    tuples: AlgoTuple[] = [],
    algos: Algorithm[] = []
  ): AlgoTuple[] {
    return tuples.map(([category, als]) => [
      category,
      als.filter((algo) => algos.includes(algo)),
    ]);
  }

  // INFO: prefetches tmr and ytd
  client.prefetchQuery(prefetchOpt(DEFAULT_DAYS[(dayIndex + 1) % 7]));
  client.prefetchQuery(prefetchOpt(DEFAULT_DAYS[(dayIndex + 6) % 7]));

  return {
    isLoading: algoDb.isLoading || algoByDays.isLoading,
    isError: algoDb.isLoading || algoByDays.isError,
    data: processData(algoDb.data, algoByDays.data),
  };
};
