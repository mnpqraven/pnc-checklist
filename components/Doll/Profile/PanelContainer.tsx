import ClassFilter from "@/components/ClassFilter";
import { ENUM_TABLE } from "@/src-tauri/bindings/ENUM_TABLE";
import { Class, Unit } from "@/src-tauri/bindings/rspc";
import { useEnumTable } from "@/utils/hooks/useEnumTable";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import DollList from "../DollList";

const DollPanelContainer = () => {
  const { filter, updateFilter, isVisible } = useFilter();

  return (
    <div className="panel_left component_space flex flex-col items-center">
      <ClassFilter onChange={updateFilter} />
      <DollList filter={filter} isVisible={isVisible} />
    </div>
  );
};
export default DollPanelContainer;

const useFilter = () => {
  const { data: classIter } = useEnumTable<Class>(ENUM_TABLE.Class);

  const [filter, setFilter] = useImmer<Class[]>([]);
  useEffect(() => {
    if (classIter) setFilter(classIter);
  }, [classIter, setFilter]);

  const updateFilter = (to: Class) => {
    setFilter((draft) => {
      if (filter.includes(to)) draft.splice(draft.indexOf(to), 1);
      else draft.push(to);
      return draft;
    });
  };

  const isVisible = (obj: Unit, pat: Class[]) => pat.includes(obj.class as Class);
  return { filter, updateFilter, isVisible };
};
