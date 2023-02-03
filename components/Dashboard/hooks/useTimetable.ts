import { ResourceByDay } from "@/src-tauri/bindings/structs";
import { useQueries, useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";

export const useTimetable = () => {
  let timetable: ResourceByDay[] = [];

  const { data: enum_days } = useQuery({
    queryKey: ["enum_ls", "Day"],
    queryFn: () => invoke<string[]>("enum_ls", { name: "Day" }),
  });

  const bonusQueries = useQueries({
    queries: (enum_days ? enum_days : []).map((day) => ({
      queryKey: ["bonus", day, enum_days],
      queryFn: () => invoke<ResourceByDay>("get_bonuses", { day }),
      enabled: !!enum_days,
    })),
  });

  if (bonusQueries.every((e) => e.isSuccess))
    bonusQueries.forEach((bonus) => {
      if (bonus.data) timetable.push(bonus.data);
    });

  return timetable;
};