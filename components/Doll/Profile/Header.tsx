import { DollContext, ToastContext } from "@/interfaces/payloads";
import Label from "../../Form/Label";
import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import { ClassSelect } from "./ClassSelect";

type Props = {
  handleSave: () => void;
  canSave: boolean;
};
const DollHeader = ({ handleSave, canSave }: Props) => {
  const { dollData, setDollData } = useContext(DollContext);
  const { fireToast } = useContext(ToastContext);

  if (!dollData || !setDollData) return null;

  return (
    <div className="card component_space flex items-center">
      <Label
        id="unitName"
        value={dollData.name}
        label="Name"
        onChange={(e) =>
          setDollData((draft) => {
            draft.name = e.target.value;
          })
        }
      />

      <ClassSelect
        value={dollData.class}
        onChangeHandler={(e) =>
          setDollData((draft) => {
            draft.class = e;
          })
        }
      />
      <div className="grow" />

      <AnimatePresence>
        {canSave && (
          <motion.button
            className="Button big violet"
            onClick={() => {
              handleSave();
              fireToast();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Save changes
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DollHeader;
