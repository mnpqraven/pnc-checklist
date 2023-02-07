import { Unit } from "@/src-tauri/bindings/structs";
import { class_src } from "@/utils/helper";
import Image from "next/image";

type Props = {
  unit: Unit;
  deleteMode: boolean;
  deleteUnit: () => void;
};
const DollListItem = ({ unit, deleteMode, deleteUnit }: Props) => {
  return (
    <div className="flex items-center">
      <div className="mx-2 shrink-0">
        <Image
          src={class_src(unit.class)}
          alt={unit.class}
          width={24}
          height={24}
        />
      </div>
      <div>
        <p>{unit.name ? unit.name : "No name"}</p>
        <p>
          {unit.current.skill_level?.passive}/{unit.current.skill_level?.auto}
        </p>
      </div>

      {deleteMode && (
        <div
          className="ml-4 mr-2 text-right text-3xl text-red-400"
          onClick={(e) => {
            e.stopPropagation();
            if (deleteMode) deleteUnit();
          }}
        >
          
        </div>
      )}
    </div>
  );
};

export default DollListItem;
