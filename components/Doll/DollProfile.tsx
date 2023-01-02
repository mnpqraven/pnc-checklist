import { Unit, CLASS, Class, LOADOUTTYPE } from "@/interfaces/datamodel";
import { ChangeEvent, useContext } from "react";
import { Select, Loadout } from "@/components/Common";
import React from "react";
import { DollContext } from "@/interfaces/payloads";
import styles from "@/styles/Page.module.css";

const DollProfile = () => {
  const { dollData, setDollData, updateDirtyList } = useContext(DollContext);
  const defined = dollData && setDollData && updateDirtyList;

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    if (defined) {
      let editedData: Unit = { ...dollData, name: e.currentTarget.value };
      updateDirtyList(editedData);
    }
  }
  function handleClassChange(e: ChangeEvent<HTMLSelectElement>) {
    if (defined) {
      let editedData: Unit = {
        ...dollData,
        class: e.currentTarget.value as Class,
      };
      updateDirtyList(editedData);
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
            skill_level={dollData.current.skill_level}
            algo={dollData.current.algo}
            type={LOADOUTTYPE.current}
          />
        </div>
        <div className={styles.loadout}>
          <Loadout
            skill_level={dollData.goal.skill_level}
            algo={dollData.goal.algo}
            type={LOADOUTTYPE.goal}
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
