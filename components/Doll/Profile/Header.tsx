import { DollContext, SaveContext, ToastContext } from "@/interfaces/payloads";
import Label from "../../Form/Label";
import { AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { ClassSelect } from "./ClassSelect";
import Button from "@/components/Button";

const DollHeader = ({ handleSave }: { handleSave: () => void }) => {
  const { dollData, setDollData } = useContext(DollContext);
  const { fireToast } = useContext(ToastContext);
  const { isUnsaved } = useContext(SaveContext);

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
        {isUnsaved && (
          <Button
            label="Save changes"
            onClick={() => {
              handleSave();
              fireToast();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DollHeader;
