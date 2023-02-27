import Slider from "@/components/Form/Slider";
import { DbDollContext } from "@/interfaces/payloads";
import { UnitSkill } from "@/src-tauri/bindings/rspc";
import { useContext } from "react";
import Skeleton from "react-loading-skeleton";

const SKILL_TYPE = { passive: "passive", auto: "auto" };
type SkillType = keyof typeof SKILL_TYPE;

type Props = {
  loadoutId: string;
};
const SkillBox = ({ loadoutId }: Props) => {
  const { skills, updateSkill } = useContext(DbDollContext);

  const skillData = skills.find((e) => e.loadoutId == loadoutId)!;
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

  function prepareUpdate(
    to: number,
    skillType: "auto" | "passive",
    loadoutId: string
  ) {
    let obj: UnitSkill = skillData;
    switch (skillType) {
      case "auto":
        obj = { ...skillData, auto: to };
        break;
      case "passive":
        obj = { ...skillData, passive: to };
        break;
    }

    updateSkill(obj, loadoutId);
  }
  return (
    <div className="mx-4 flex flex-col">
      <div className="flex flex-col ">
        <div className="flex justify-between"></div>
        {skillData ? (
          skill.map(({ type, label }) => (
            <Slider
              key={type}
              type={type}
              min={1}
              max={10}
              label={label}
              value={skillData[type]}
              onChange={(e) => prepareUpdate(e[0], type, loadoutId)}
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
