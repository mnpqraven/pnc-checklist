import {
  DbDollContext,
  SaveContext,
  ToastContext,
} from "@/interfaces/payloads";
import Label from "../../Form/Label";
import { AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { ClassSelect } from "./ClassSelect";
import Button from "@/components/Button";
import { Class } from "@/src-tauri/bindings/rspc";
import { SUCCESS, TOAST_SAVE_CONTENT_OK } from "@/utils/lang";

const DollHeader = () => {
  const { currentUnit, updateCurrentUnit, saveDatabase } =
    useContext(DbDollContext);
  const { fireToast } = useContext(ToastContext);
  const { isUnsaved } = useContext(SaveContext);
  function saveOnClick() {
    saveDatabase()
      .catch((err) => {
        fireToast({
          header: "Save failed",
          content: `Saving data failed. Reason: ${err}`,
        });
      })
      .finally(() =>
        fireToast({ header: SUCCESS, content: TOAST_SAVE_CONTENT_OK })
      );
  }

  if (!currentUnit || !updateCurrentUnit) return null;

  return (
    <div className="card component_space flex items-center">
      <Label
        id="unitName"
        value={currentUnit.name}
        label="Name"
        onChange={(e) =>
          updateCurrentUnit({ ...currentUnit, name: e.target.value })
        }
      />

      <ClassSelect
        value={currentUnit.class as Class}
        onChangeHandler={(e) => updateCurrentUnit({ ...currentUnit, class: e })}
      />
      <div className="grow" />

      <AnimatePresence>
        {isUnsaved && <Button label="Save changes" onClick={saveOnClick} />}
      </AnimatePresence>
    </div>
  );
};

export default DollHeader;
