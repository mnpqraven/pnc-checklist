import { AlgoCategory, Algorithm, Day } from "@/src-tauri/bindings/enums";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import { DEFAULT_DAYS } from "../defaults";

type AlgoTuple = [AlgoCategory, Algorithm[]];

export const useAlgoDbQuery = () => {
  const algoDb = useQuery({
    queryKey: ["algoDb"],
    queryFn: () => invoke<AlgoTuple[]>("get_algo_db"),
  });
    return algoDb
}

export const useAlgoByDayQuery = (dayIndex: number) => {
  const client = useQueryClient();
  const day = DEFAULT_DAYS[dayIndex];
  const algoDb = useAlgoDbQuery();

  const prefetchOpt = (day: Day) => ({
    queryKey: ["algo_by_days", algoDb.data, day],
    queryFn: () => invoke<Algorithm[]>("get_algo_by_days", { day }),
  });

  const algoByDays = useQuery({
    // NOTE: query again when day changes
    queryKey: ["algo_by_days", algoDb.data, day],
    queryFn: () => invoke<Algorithm[]>("get_algo_by_days", { day }),
    enabled: !!algoDb.data,
  });

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
    isError: algoDb.isError || algoByDays.isError,
    data: processData(algoDb.data, algoByDays.data),
  };
};
