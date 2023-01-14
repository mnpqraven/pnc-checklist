import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Select, Loadout } from "@/components/Common";
import React from "react";
import { DollContext } from "@/interfaces/payloads";
import styles from "@/styles/Page.module.css";
import { Class } from "@/src-tauri/bindings/enums";
import { invoke } from "@tauri-apps/api/tauri";

const DollProfile = () => {
  const { dollData, setDollData } = useContext(DollContext);
  const [options, setOptions] = useState<string[]>([]);
  const defined = setDollData;

  useEffect(() => {
    invoke<string[]>("enum_ls", { name: "Class" }).then(setOptions);
  }, []);

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    if (defined) {
      setDollData((draft) => {
        if (draft) draft.name = e.target.value;
      });
    }
  }
  function handleClassChange(e: ChangeEvent<HTMLSelectElement>) {
    if (defined) {
      setDollData((draft) => {
        if (draft) draft.class = e.target.value as Class;
      });
    }
  }

  // NOTE: probably move data stuct here to eliminate undefined case
  // TODO: goal loadout
  if (dollData)
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
        <div className={styles.loadout}>
          <Loadout type={"current"} data={dollData.current} />
        </div>
        <div className={styles.loadout}>
          <Loadout type={"goal"} data={dollData.goal} />
        </div>
      </>
    );
  else return <Empty />;
};
export default DollProfile;

const Empty = () => (
  <>
    <p>select a doll</p>
  </>
);
