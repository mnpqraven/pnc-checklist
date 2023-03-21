import ClassFilter from "@/components/ClassFilter";
import { useClassFilter } from "@/utils/hooks/useClassFilter";
import DollList from "../DollList";

const DollPanelContainer = () => {
  const { filter, updateFilter, isVisible } = useClassFilter();

  return (
    <div className="panel_left component_space flex flex-col items-center">
      <ClassFilter onChange={updateFilter} />
      <DollList filter={filter} isVisible={isVisible} />
    </div>
  );
};
export default DollPanelContainer;
