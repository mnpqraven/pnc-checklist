import { Unit, CLASS, Class, LOADOUTTYPE } from "@/interfaces/datamodel";
import { ChangeEvent, useContext } from "react";
import { Select, Loadout } from "@/components/Common";
import React from "react";
import { DollContext } from "@/interfaces/payloads";
import styles from "@/styles/Page.module.css";

const DollProfile = () => {
  const { dollData, setDollData, updateDirtyList } = useContext(DollContext);
  const defined = setDollData && updateDirtyList;

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
              options={Object.values(CLASS)}
              value={dollData.class}
              onChangeHandler={handleClassChange}
            />
          </div>
        </div>
        <div className={styles.loadout}>
          <Loadout
            type={LOADOUTTYPE.current}
            data={dollData.current}
          />
        </div>
        <div className={styles.loadout}>
          <Loadout
            type={LOADOUTTYPE.goal}
            data={dollData.goal}
          />
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
