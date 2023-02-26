import { Class, Unit } from "@/src-tauri/bindings/rspc";
import { class_src } from "@/utils/helper";
import { TrashIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import ErrorContainer from "../Error";
import Loading from "../Loading";
import { rspc } from "../Toast/Providers";

type Props = {
  unit: Unit;
  deleteMode: boolean;
  deleteUnit: () => void;
};
const DollListItem = ({ unit, deleteMode, deleteUnit }: Props) => {
  const { data, isLoading, isError } = rspc.useQuery([
    "skillLevelByUnitId",
    [unit.id, 'Current'],
  ]);


  if (isLoading) return <Loading />;
  if (isError) return <ErrorContainer />;

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
          {data.passive}/{data.auto}
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
