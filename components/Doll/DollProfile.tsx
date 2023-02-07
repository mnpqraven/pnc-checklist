import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Select, LoadoutContainer } from "@/components/Common";
import React from "react";
import { DollContext } from "@/interfaces/payloads";
import { Class, LoadoutType } from "@/src-tauri/bindings/enums";
import { invoke } from "@tauri-apps/api/tauri";
import { Loadout } from "@/src-tauri/bindings/structs";
import LoadoutConfig from "../Loadout/Config";
import Skeleton from "react-loading-skeleton";

type LoadoutParams = {
  data: Loadout;
  type: LoadoutType;
};

type Props = {
  handleSave: () => void;
  canSave: boolean;
};
const DollProfile = ({ handleSave, canSave }: Props) => {
  const { dollData, setDollData } = useContext(DollContext);
  const [options, setOptions] = useState<string[]>([]);
  const loadouts: LoadoutType[] = ["current", "goal"];
  const { storeLoading } = useContext(DollContext);

  useEffect(() => {
    invoke<string[]>("enum_ls", { name: "Class" }).then(setOptions);
  }, []);

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    if (setDollData) {
      setDollData((draft) => {
        if (draft) draft.name = e.target.value;
      });
    }
  }
  function handleClassChange(e: ChangeEvent<HTMLSelectElement>) {
    if (setDollData) {
      setDollData((draft) => {
        if (draft) draft.class = e.target.value as Class;
      });
    }
  }

  return (
    <div className="flex flex-grow flex-col" >
      <div className="flex flex-row [&>div]:px-2">
        <div>
          {dollData ? (
            <input
              type="text"
              id="name"
              value={dollData.name}
              onChange={handleNameChange}
            />
          ) : (
            <div className="w-52">
              <Skeleton />
            </div>
          )}
        </div>
        <div>
          {dollData ? (
            <Select
              options={options}
              value={dollData.class}
              onChangeHandler={handleClassChange}
            />
          ) : (
            <div className="w-28">
              <Skeleton />
            </div>
          )}
        </div>
        <button
          disabled={!canSave}
          className={canSave ? "animate-pulse" : "opacity-40"}
          onClick={handleSave}
        >
          Save changes
        </button>
      </div>
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
