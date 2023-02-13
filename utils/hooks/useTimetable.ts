import { Day } from "@/src-tauri/bindings/enums";
import { ENUM_TABLE } from "@/src-tauri/bindings/ENUM_TABLE";
import { IVK } from "@/src-tauri/bindings/invoke_keys";
import { ResourceByDay } from "@/src-tauri/bindings/structs";
import { useQueries } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import { useEnumTable } from "./useEnumTable";

export const useTimetable = () => {
  let timetable: ResourceByDay[] = [];
  const { data: enum_days } = useEnumTable<Day>(ENUM_TABLE.Day);

  const bonusQueries = useQueries({
    queries: (enum_days ? enum_days : []).map((day) => ({
      queryKey: [IVK.GET_BONUSES, day, enum_days],
      queryFn: () => invoke<ResourceByDay>(IVK.GET_BONUSES, { day }),
      enabled: !!enum_days,
    })),
  });

  if (bonusQueries.every((e) => e.isSuccess))
    bonusQueries.forEach((bonus) => {
      if (bonus.data) timetable.push(bonus.data);
    });

  return timetable;
};
