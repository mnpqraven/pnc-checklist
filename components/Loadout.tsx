import {
  AlgoSet,
  LOADOUTTYPE,
  LoadoutType,
  NeuralExpansion,
  Unit,
  UnitSkill,
} from "@/interfaces/datamodel";
import AlgorithmSet from "@/components/Algorithm/AlgorithmSet";
import { ChangeEvent, useContext } from "react";
import { DollContext } from "@/interfaces/payloads";
import RaritySelect from "./Doll/RaritySelect";

type Props = {
  skill_level: UnitSkill;
  algo: AlgoSet;
  type: LoadoutType;
  level: number
};
const Loadout = ({ skill_level, algo, type, level }: Props) => {
  const { dollData, setDollData, updateDirtyList } = useContext(DollContext);
  const defined = dollData && setDollData && updateDirtyList;

  const SKILL_TYPE = { passive: "passive", auto: "auto" };
  type SkillType = keyof typeof SKILL_TYPE;

  function handleSlvChange(
    e: ChangeEvent<HTMLInputElement>,
    skill_type: string
  ) {
    if (defined) {
      setDollData((draft) => {
        draft[type].skill_level[skill_type as SkillType] = +e.target.value;
      });
    }
  }
  function handleRarityChange(e: string) {
    if (defined) {
      setDollData((draft) => {
        draft[type].neural = e as NeuralExpansion;
      });
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
              value={skill_level.passive}
              onChange={(e) => handleSlvChange(e, SKILL_TYPE.passive)}
            />
            <p>{skill_level.passive}</p>
            <p>level:</p>
            <input type="number" defaultValue={level} min={1} max={70} />
          </div>
          <div className="flex flex-row justify-end">
            <p>auto: </p>
            <input
              className="p-0"
              type="range"
              min={1}
              max={10}
              value={skill_level.auto}
              onChange={(e) => handleSlvChange(e, SKILL_TYPE.auto)}
            />
            <p>{skill_level.auto}</p>
          </div>
        </div>
        <div>
          <RaritySelect onChange={handleRarityChange} />
        </div>
      </div>
      <AlgorithmSet algo={algo} type={type} />
    </>
  );
};
export default Loadout;
