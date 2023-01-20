import AlgorithmSet from "@/components/Algorithm/AlgorithmSet";
import { ChangeEvent, useContext } from "react";
import { DollContext } from "@/interfaces/payloads";
import RaritySelect from "./Doll/RaritySelect";
import { Loadout } from "@/src-tauri/bindings/structs";
import { LoadoutType, NeuralExpansion } from "@/src-tauri/bindings/enums";

type Props = {
  type: LoadoutType;
  data: Loadout;
};

const SKILL_TYPE = { passive: "passive", auto: "auto" };
type SkillType = keyof typeof SKILL_TYPE;

const Loadout = ({ type, data }: Props) => {

  const { dollData, setDollData } = useContext(DollContext);
  const defined = dollData && setDollData;
  const { algo, neural } = data;

  function handleSlvChange(
    e: ChangeEvent<HTMLInputElement>,
    skill_type: string
  ) {
    if (defined)
      setDollData((draft) => {
        if (draft)
          draft[type].skill_level[skill_type as SkillType] = +e.target.value;
      });
  }

  function handleLevelChange(e: ChangeEvent<HTMLInputElement>) {
    if (defined)
      setDollData((draft) => {
        if (draft) draft[type].level = +e.target.value;
      });
  }

  function handleFragsChange(e: ChangeEvent<HTMLInputElement>) {
    if (defined)
      setDollData((draft) => {
        if (draft) draft[type].frags = +e.target.value;
      });
  }

  function handleRarityChange(e: string) {
    if (defined)
      setDollData((draft) => {
        if (draft) draft[type].neural = e as NeuralExpansion;
      });
  }

  return (
    <>
      <div className="flex flex-row">
        <div className="flex">
          <SkillBox data={data} handleSlvChange={handleSlvChange} />
          <LevelBox
            data={data}
            handleFragsChange={handleFragsChange}
            handleLevelChange={handleLevelChange}
          />
        </div>
        <RaritySelect value={neural} onChange={handleRarityChange} />
      </div>
      <AlgorithmSet algo={algo} type={type} />
    </>
  );
};

const LevelBox = ({
  data,
  handleLevelChange,
  handleFragsChange,
}: {
  data: Loadout;
  handleLevelChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFragsChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {

  const { level, frags } = data;

  return (
    <div className="flex flex-col flex-grow-0">
      <p>level:</p>
      <input
        type="number"
        value={level}
        min={1}
        max={70}
        onChange={handleLevelChange}
      />
      {frags != null ? (
        <>
          <p>frags:</p>
          <input
            type="number"
            value={frags}
            min={0}
            max={999}
            onChange={handleFragsChange}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

const SkillBox = ({
  data,
  handleSlvChange,
}: {
  data: Loadout;
  handleSlvChange: (
    e: ChangeEvent<HTMLInputElement>,
    skill_type: SkillType
  ) => void;
}) => {

  const { skill_level } = data;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <p>Passive Skill: </p>
          <p>{skill_level.passive}</p>
        </div>
        <input
          className="p-0"
          type="range"
          min={1}
          max={10}
          value={skill_level.passive}
          onChange={(e) => handleSlvChange(e, SKILL_TYPE.passive as SkillType)}
        />
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <p>Auto Skill: </p>
          <p>{skill_level.auto}</p>
        </div>
        <input
          className="p-0"
          type="range"
          min={1}
          max={10}
          value={skill_level.auto}
          onChange={(e) => handleSlvChange(e, SKILL_TYPE.auto as SkillType)}
        />
      </div>
    </div>
  );
};

export default Loadout;
