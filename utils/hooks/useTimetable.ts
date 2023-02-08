import { INVOKE_KEYS } from "@/src-tauri/bindings/invoke_keys";
import { ResourceByDay } from "@/src-tauri/bindings/structs";
import { useQueries, useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";

export const useTimetable = () => {
  let timetable: ResourceByDay[] = [];

  const { data: enum_days } = useQuery({
    queryKey: [INVOKE_KEYS.ENUM_LS, "Day"],
    queryFn: () => invoke<string[]>(INVOKE_KEYS.ENUM_LS, { name: "Day" }),
  });

  const bonusQueries = useQueries({
    queries: (enum_days ? enum_days : []).map((day) => ({
      queryKey: [INVOKE_KEYS.GET_BONUSES, day, enum_days],
      queryFn: () => invoke<ResourceByDay>(INVOKE_KEYS.GET_BONUSES, { day }),
      enabled: !!enum_days,
    })),
  });

  if (bonusQueries.every((e) => e.isSuccess))
    bonusQueries.forEach((bonus) => {
      if (bonus.data) timetable.push(bonus.data);
    });

  return timetable;
};
