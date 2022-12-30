import {
  AlgoSet,
  LOADOUTTYPE,
  LoadoutType,
  Unit,
  UnitSkill,
} from "@/interfaces/datamodel";
import AlgorithmSet from "@/components/Algorithm/AlgorithmSet";
import { ChangeEvent, useContext } from "react";
import { DollContext } from "@/interfaces/payloads";
import styles from "@/styles/Page.module.css";

type Props = {
  skill_level: UnitSkill | undefined;
  algo: AlgoSet;
  type: LoadoutType;
};
const Loadout = ({ skill_level, algo, type }: Props) => {
  const { dollData, setDollData, updateDirtyList } = useContext(DollContext);
  const defined = dollData && setDollData && updateDirtyList;

  function handleSlvChange(
    e: ChangeEvent<HTMLInputElement>,
    skill_type: string
  ) {
    if (defined) {
      // TODO: try useImmer
      let clone: Unit = { ...dollData };
      let sk = clone.current.skill_level; // default unit, won't be reading this
      switch (type) {
        case LOADOUTTYPE.current:
          sk = clone.current.skill_level;
          break;
        case LOADOUTTYPE.goal:
          sk = clone.goal.skill_level;
          break;
      }
      if (sk) {
        switch (skill_type) {
          case "passive":
            sk.passive = +e.target.value;
            break;
          case "auto":
            sk.auto = +e.target.value;
            break;
        }
      }
      updateDirtyList(clone);
    }
  }
  return (
    <>
      <p>Skill level: </p>
      <div>
        <input
          type="number"
          min={1}
          max={10}
          value={skill_level?.passive}
          onChange={(e) => handleSlvChange(e, "passive")}
        />
        <input
          type="number"
          min={1}
          max={10}
          value={skill_level?.auto}
          onChange={(e) => handleSlvChange(e, "auto")}
        />
      </div>
      <AlgorithmSet algo={algo} type={type} />
    </>
  );
};
export default Loadout;
