import AlgorithmSet from "@/components/Algorithm/AlgorithmSet";
import { useContext } from "react";
import { DollContext } from "@/interfaces/payloads";
import { Loadout } from "@/src-tauri/bindings/structs";
import { LoadoutType } from "@/src-tauri/bindings/enums";
import { LevelBox, RaritySelect, SkillBox } from "./Doll";
import useLoadoutController from "@/utils/hooks/useLoadoutController";

type Props = {
  type: LoadoutType;
  data: Loadout | undefined;
};

const LoadoutContainer = ({ type, data }: Props) => {
  const { setDollData } = useContext(DollContext);
  // const { algo, neural, skill_level: slv } = data;
  const control = useLoadoutController(setDollData, type);

  return (
    <>
      <div className="flex flex-row">
        <div className="flex items-center">
          <SkillBox
            skill_level={data?.skill_level}
            handleSlvChange={control.slv}
          />
          <LevelBox
            type={type}
            data={data}
            handleFragsChange={control.frags}
            handleLevelChange={control.level}
          />
          {data && (
            <RaritySelect value={data.neural} onChange={control.rarity} />
          )}
        </div>
      </div>
      <AlgorithmSet algo={data?.algo} type={type} />
    </>
  );
};

export default LoadoutContainer;
