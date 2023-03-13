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

const DollHeader = () => {
  // TODO: expand saveUnits to all dirty entries
  // to Promise, needs to handle rejection with fireToast
  const { currentUnit, updateCurrentUnit, saveDatabase } =
    useContext(DbDollContext);
  const { fireToast } = useContext(ToastContext);
  const { isUnsaved } = useContext(SaveContext);

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
        {isUnsaved && (
          <Button
            label="Save changes"
            onClick={() => {
              saveDatabase();
              fireToast();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DollHeader;
