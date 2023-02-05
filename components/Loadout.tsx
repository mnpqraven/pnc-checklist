import AlgorithmSet from "@/components/Algorithm/AlgorithmSet";
import { useContext } from "react";
import { DollContext } from "@/interfaces/payloads";
import { Loadout } from "@/src-tauri/bindings/structs";
import { LoadoutType } from "@/src-tauri/bindings/enums";
import { LevelBox, RaritySelect, SkillBox } from "./Doll";
import Loading from "./Loading";
import useLoadoutController from "@/utils/hooks/useLoadoutController";

type Props = {
  type: LoadoutType;
  data: Loadout;
};

const LoadoutContainer = ({ type, data }: Props) => {
  const { setDollData } = useContext(DollContext);
  const { algo, neural, skill_level: slv } = data;

  if (!setDollData) return <Loading />;

  const control = useLoadoutController(setDollData, type);
  return (
    <>
      <div className="flex flex-row">
        <div className="flex items-center">
          <SkillBox skill_level={slv} handleSlvChange={control.slv} />
          <LevelBox
            data={data}
            handleFragsChange={control.frags}
            handleLevelChange={control.level}
          />
          <RaritySelect value={neural} onChange={control.rarity} />
        </div>
      </div>
      <AlgorithmSet algo={algo} type={type} />
    </>
  );
};

export default LoadoutContainer;
