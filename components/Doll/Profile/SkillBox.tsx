import Slider from "@/components/Form/Slider";
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
    e: ChangeEvent<HTMLInputElement> | number,
    skill_type: SkillType
  ) => void;
}) => {
  const skill: { type: SkillType; label: string }[] = [
    {
      type: "passive",
      label: "Passive Skill",
    },
    {
      type: "auto",
      label: "Auto Skill",
    },
  ];
  return (
    <div className="mx-4 flex flex-col">
      <div className="flex flex-col ">
        <div className="flex justify-between"></div>
        {skill_level ? (
          skill.map(({ type, label }) => (
            <Slider
              key={type}
              type={type}
              min={1}
              max={10}
              label={label}
              value={skill_level[type]}
              onChange={(e) => handleSlvChange(e[0], type)}
            />
          ))
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
