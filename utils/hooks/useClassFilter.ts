import { rspc } from "@/components/Providers/ClientProviders";
import { Class, Unit } from "@/src-tauri/bindings/rspc";
import { useEffect } from "react";
import { useImmer } from "use-immer";

export const useClassFilter = () => {
  const { data: classIter } = rspc.useQuery(['enum.Class'])

  const [filter, setFilter] = useImmer<Class[]>([]);
  useEffect(() => {
    if (classIter) setFilter(classIter.map(e => e.label));
  }, [classIter, setFilter]);

  const updateFilter = (to: Class) => {
    setFilter((draft) => {
      if (filter.includes(to)) draft.splice(draft.indexOf(to), 1);
      else draft.push(to);
      return draft;
    });
  };

  const isVisible = (obj: Unit, pat: Class[]) =>
    pat.includes(obj.class as Class);
  return { filter, updateFilter, isVisible };
};
