import { UnitSkill } from "@/src-tauri/bindings/structs";
import { ChangeEvent } from "react";

const SKILL_TYPE = { passive: "passive", auto: "auto" };
type SkillType = keyof typeof SKILL_TYPE;

const SkillBox = ({
  skill_level,
  handleSlvChange,
}: {
  skill_level: UnitSkill;
  handleSlvChange: (
    e: ChangeEvent<HTMLInputElement>,
    skill_type: SkillType
  ) => void;
}) => {
  return (
    <div className="mx-4 flex flex-col">
      <div className="flex flex-col ">
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
export default SkillBox;
