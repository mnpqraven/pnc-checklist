import { ChangeEvent, useContext } from "react";
import { LoadoutContainer } from "@/components/Common";
import React from "react";
import { DollContext } from "@/interfaces/payloads";
import { Class, LoadoutType } from "@/src-tauri/bindings/enums";
import LoadoutConfig from "../Loadout/Config";
import Skeleton from "react-loading-skeleton";
import { ClassSelect } from "./Profile/ClassSelect";
import { motion } from "framer-motion";

type Props = {
  handleSave: () => void;
  canSave: boolean;
};
const DollProfile = ({ handleSave, canSave }: Props) => {
  const { dollData, setDollData } = useContext(DollContext);
  const loadouts: LoadoutType[] = ["current", "goal"];
  const { storeLoading } = useContext(DollContext);

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
        <div className="flex [&>*]:mx-2">
          <input
            type="text"
            id="name"
            value={dollData.name}
            onChange={handleNameChange}
          />
          <ClassSelect
            value={dollData.class}
            onChangeHandler={handleClassChange}
          />
          {canSave && (
            <motion.button
              className={` absolute left-1/2
            ${canSave ? `animate-pulse` : `opacity-40`}`}
              onClick={handleSave}
              initial={{ opacity: 0 }}
              animate={{
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
              exit={{ opacity: 0 }}
            >
              Save changes
            </motion.button>
          )}
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
            <div
              className="absolute right-0 float-right flex flex-col"
              // initial={{ opacity: 0 }}
              // animate={{ opacity: 1 }}
            >
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
