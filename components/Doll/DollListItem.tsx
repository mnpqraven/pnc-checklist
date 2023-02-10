import { Unit } from "@/src-tauri/bindings/structs";
import { class_src } from "@/utils/helper";
import { AnimatePresence, motion } from "framer-motion";
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
      <div className="grow" />
      <AnimatePresence>
        {deleteMode && (
          <motion.div
            className="ml-4 mr-2 text-right text-3xl text-red-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              if (deleteMode) deleteUnit();
            }}
          >
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DollListItem;
