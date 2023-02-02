import { AlgoCategory, Algorithm } from "@/src-tauri/bindings/enums";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";

type AlgoTuple = [AlgoCategory, Algorithm[]];

export const useAlgoByDayQuery = (day: string) => {
  const algoDb = useQuery({
    queryKey: ["algoDb"],
    queryFn: () => invoke<AlgoTuple[]>("get_algo_db"),
  });

  const algoByDays = useQuery({
    queryKey: ["algo_by_days", algoDb.data, day], // query again when day changes
    queryFn: () => invoke<Algorithm[]>("get_algo_by_days", { day }),
    enabled: !!algoDb.data,
  });

  const data: AlgoTuple[] =
    !algoDb.data || !algoByDays.data
      ? []
      : algoDb.data.map(([category, als]) => [
          category,
          als.filter((algo) => algoByDays.data.includes(algo)),
        ]);

  return {
    isLoading: algoDb.isLoading || algoByDays.isLoading,
    isError: algoDb.isError || algoByDays.isError,
    data,
  };
};
