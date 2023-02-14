import ClassFilter from "@/components/ClassFilter";
import { DollContext } from "@/interfaces/payloads";
import { Class } from "@/src-tauri/bindings/enums";
import { ENUM_TABLE } from "@/src-tauri/bindings/ENUM_TABLE";
import { useEnumTable } from "@/utils/hooks/useEnumTable";
import { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import DollList from "../DollList";

// TODO: can't select after filtering
// bad indexes
const DollPanelContainer = () => {
  const {data: classIter} = useEnumTable<Class>(ENUM_TABLE.Class)
  const {dirtyStore} = useContext(DollContext)

  const [filter, setFilter] = useImmer<Class[]>([])
  useEffect(()=> {
    if (classIter) setFilter(classIter)
  }, [classIter, setFilter])

  const updateFilter = (to: Class) => {
    setFilter((draft) => {
      if (filter.includes(to)) draft.splice(draft.indexOf(to), 1);
      else draft.push(to);
      return draft;
    });
  };

  if (!dirtyStore) return null
  const storeAfterFilter = dirtyStore.filter(unit => filter.includes(unit.class))

  return (
    <div className="panel_left component_space flex flex-col items-center">
      <ClassFilter onChange={updateFilter} />
      <DollList filtered={storeAfterFilter}/>
    </div>
  );
};
export default DollPanelContainer;
