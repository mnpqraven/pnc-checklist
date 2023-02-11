import { DollContext, ToastContext } from "@/interfaces/payloads";
import Label from "../../Form/Label";
import { AnimatePresence, motion } from "framer-motion";
import { ChangeEvent, useContext } from "react";
import { ClassSelect } from "./ClassSelect";
import { Class } from "@/src-tauri/bindings/enums";

type Props = {
  handleSave: () => void
  canSave: boolean;
}
const DollHeader = ({handleSave, canSave} : Props) => {
  const { dollData, setDollData } = useContext(DollContext);
  const { fireToast } = useContext(ToastContext);
  if (!dollData) return null;

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    if (setDollData) {
      setDollData((draft) => {
        if (draft) draft.name = e.target.value;
      });
    }
  }

  function handleClassChange(e: Class) {
    if (setDollData) {
      setDollData((draft) => {
        if (draft) draft.class = e;
      });
    }
  }

  return (
    <div className="flex card component_space">
      <Label
        id="unitName"
        value={dollData.name}
        label="Name"
        onChange={handleNameChange}
      />

      <ClassSelect value={dollData.class} onChangeHandler={handleClassChange} />
      <div className="grow" />
      <AnimatePresence>
        {canSave && (
          <motion.button
            className="Button small violet"
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
