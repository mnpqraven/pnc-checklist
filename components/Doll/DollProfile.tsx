import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Select, LoadoutContainer } from "@/components/Common";
import React from "react";
import { DollContext } from "@/interfaces/payloads";
import { Class, LoadoutType } from "@/src-tauri/bindings/enums";
import { invoke } from "@tauri-apps/api/tauri";
import { Loadout } from "@/src-tauri/bindings/structs";
import LoadoutConfig from "../Loadout/Config";

type LoadoutParams = {
  data: Loadout;
  type: LoadoutType;
};

const DollProfile = () => {
  const { dollData, setDollData } = useContext(DollContext);
  const [options, setOptions] = useState<string[]>([]);
  const loadouts: LoadoutType[] = ["current", "goal"];

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

  if (dollData && setDollData) {
    return (
      <>
        <div className="flex flex-row [&>div]:px-2">
          <div>
            <input
              type="text"
              id="name"
              value={dollData.name}
              onChange={handleNameChange}
            />
          </div>
          <div>
            <Select
              options={options}
              value={dollData.class}
              onChangeHandler={handleClassChange}
            />
          </div>
        </div>
        {/* NOTE: named css */}
        {loadouts.map((type, index) => (
          <div className="card component_space relative" key={index}>
            <div className="absolute right-0 float-right flex flex-col">
              <LoadoutConfig unitHandler={setDollData} type={type} />
            </div>
            <LoadoutContainer
              type={type as LoadoutType}
              data={dollData[type]}
            />
          </div>
        ))}
      </>
    );
  } else return <Empty />;
};
export default DollProfile;

const Empty = () => (
  <>
    <p>select a doll</p>
  </>
);
