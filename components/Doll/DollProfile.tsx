import { ChangeEvent, useContext } from "react";
import { LoadoutContainer } from "@/components/Common";
import React from "react";
import { DollContext, ToastContext } from "@/interfaces/payloads";
import { Class, LoadoutType } from "@/src-tauri/bindings/enums";
import LoadoutConfig from "../Loadout/Config";
import Skeleton from "react-loading-skeleton";
import { ClassSelect } from "./Profile/ClassSelect";
import { AnimatePresence, motion } from "framer-motion";
import Label from "../Form/Label";
import Toast from "../Toast";
import { SUCCESS, TOAST_SAVE_CONTENT_OK } from "@/utils/lang";
import MainstatSelect from "../RadixDropdown";

type Props = {
  handleSave: () => void;
  canSave: boolean;
};
const DollProfile = ({ handleSave, canSave }: Props) => {
  const { dollData, setDollData } = useContext(DollContext);
  const loadouts: LoadoutType[] = ["current", "goal"];
  const { storeLoading } = useContext(DollContext);
  const { fireToast, setHeaderContent } = useContext(ToastContext);
  setHeaderContent(SUCCESS, TOAST_SAVE_CONTENT_OK);

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
    <div className="flex flex-grow flex-col">
      {dollData ? (
        <div className="flex">
          <Label
            id="unitName"
            value={dollData.name}
            label="Name"
            onChange={handleNameChange}
          />

          <ClassSelect
            value={dollData.class}
            onChangeHandler={handleClassChange}
          />
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
      ) : (
        <div className="w-52">
          <Skeleton />
        </div>
      )}

      {/* NOTE: named css */}
      {loadouts.map((type, index) => (
        <div className="card component_space relative" key={index}>
          {!storeLoading && setDollData && (
            <div className="absolute right-0 float-right flex flex-col">
              <LoadoutConfig unitHandler={setDollData} type={type} />
            </div>
          )}
          <LoadoutContainer
            type={type as LoadoutType}
            data={dollData ? dollData[type] : undefined}
          />
        </div>
      ))}
    </div>
  );
};
export default DollProfile;
