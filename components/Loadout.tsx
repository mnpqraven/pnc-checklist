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
import RaritySelect from "./Doll/RaritySelect";

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
      <div className="flex flex-row">
        <p>Skill level: </p>
        <div>
          <div className="flex flex-row justify-end">
            <p>passive: </p>
            <input
              className="p-0"
              type="range"
              min={1}
              max={10}
              value={skill_level?.passive}
              onChange={(e) => handleSlvChange(e, "passive")}
            />
            <p>{skill_level?.passive}</p>
          </div>
          <div className="flex flex-row justify-end">
            <p>auto: </p>
            <input
              className="p-0"
              type="range"
              min={1}
              max={10}
              value={skill_level?.auto}
              onChange={(e) => handleSlvChange(e, "auto")}
            />
            <p>{skill_level?.auto}</p>
          </div>
        </div>
        <div>
          <RaritySelect />
        </div>
      </div>
      <AlgorithmSet algo={algo} type={type} />
    </>
  );
};
export default Loadout;
