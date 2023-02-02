import { AlgoCategory, Algorithm, Day } from "@/src-tauri/bindings/enums";
import { GrandResource, WidgetResource } from "@/src-tauri/bindings/structs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import { DEFAULT_DAYS, DEFAULT_GRAND_RESOURCE } from "./defaults";

type AlgoTuple = [AlgoCategory, Algorithm[]];
export const useAlgoByDayQuery = (dayIndex: number) => {
  const client = useQueryClient();
  const day = DEFAULT_DAYS[dayIndex];

  const prefetchOpt = (day: Day) => ({
    queryKey: ["algo_by_days", algoDb.data, day],
    queryFn: () => invoke<Algorithm[]>("get_algo_by_days", { day }),
  });

  const algoDb = useQuery({
    queryKey: ["algoDb"],
    queryFn: () => invoke<AlgoTuple[]>("get_algo_db"),
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

export const useNeededRscQuery = () => {
  const neededRsc = useQuery({
    queryKey: ["neededRsc"],
    queryFn: () => invoke<GrandResource>("get_needed_rsc"),
    placeholderData: DEFAULT_GRAND_RESOURCE,
  });

  function processData(
    data: GrandResource = DEFAULT_GRAND_RESOURCE
  ): GrandResource {
    let noempty: WidgetResource[] = [];
    data.widgets.forEach(
      (byClass) =>
        byClass.widget_inventory.every((e) => e !== 0) && noempty.push(byClass)
    );
    return { ...data, widgets: noempty };
  }

  return {
    data: processData(neededRsc.data),
    isLoading: neededRsc.isLoading,
    isError: neededRsc.isError,
    isPlaceholderData: neededRsc.isPlaceholderData,
  };
};
