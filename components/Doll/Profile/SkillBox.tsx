import { UnitSkill } from "@/src-tauri/bindings/structs";
import { ChangeEvent } from "react";
import Skeleton from "react-loading-skeleton";

const SKILL_TYPE = { passive: "passive", auto: "auto" };
type SkillType = keyof typeof SKILL_TYPE;

const SkillBox = ({
  skill_level,
  handleSlvChange,
}: {
  skill_level: UnitSkill | undefined;
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
          {skill_level ? (
            <p>{skill_level.passive}</p>
          ) : (
            <Skeleton count={1} containerClassName="flex-grow w-12" />
          )}
        </div>
        {skill_level ? (
          <span>
            <input
              className="p-0"
              type="range"
              min={1}
              max={10}
              value={skill_level.passive}
              onChange={(e) =>
                handleSlvChange(e, SKILL_TYPE.passive as SkillType)
              }
            />
          </span>
        ) : (
          <div className="w-24">
            <Skeleton />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <p>Auto Skill: </p>
          <p>{skill_level ? skill_level.auto : <Skeleton />}</p>
        </div>
        {skill_level ? (
          <span>
            <input
              className="p-0"
              type="range"
              min={1}
              max={10}
              value={skill_level.auto}
              onChange={(e) => handleSlvChange(e, SKILL_TYPE.auto as SkillType)}
            />
          </span>
        ) : (
          <div className="w-24">
            <Skeleton />
          </div>
        )}
      </div>
    </div>
  );
};
export default SkillBox;
