import { DbDollContext } from "@/interfaces/payloads";
import { Class, Unit } from "@/src-tauri/bindings/rspc";
import { class_src } from "@/utils/helper";
import { TrashIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useContext } from "react";
import Loading from "../Loading";

type Props = {
  unit: Unit;
  deleteMode: boolean;
  deleteUnit: () => void;
  currentLoadoutId: string;
};
const DollListItem = ({
  unit,
  deleteMode,
  deleteUnit,
  currentLoadoutId,
}: Props) => {
  const { skill } = useContext(DbDollContext);
  const currentSkill = skill.data.find((e) => e.loadoutId == currentLoadoutId);
  if (!currentSkill) return <Loading />;

  return (
    <div className="flex items-center">
      <div className="mx-2 shrink-0">
        <Image
          src={class_src(unit.class as Class)}
          alt={unit.class}
          width={24}
          height={24}
        />
      </div>
      <div>
        <p>{unit.name ? unit.name : "No name"}</p>
        <p>
          {currentSkill.passive}/{currentSkill.auto}
        </p>
      </div>
      <div className="grow" />
      <AnimatePresence>
        {deleteMode && (
          <motion.button
            // className="ml-4 mr-2 text-right text-3xl text-red-400"
            className="Button small red"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              if (deleteMode) deleteUnit();
            }}
          >
            <TrashIcon />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DollListItem;
