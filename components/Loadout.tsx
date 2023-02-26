import AlgorithmSet from "@/components/Algorithm/AlgorithmSet";
import { ChangeEvent, useContext } from "react";
import { DbDollContext, DollContext } from "@/interfaces/payloads";
import { LevelBox, RaritySelect, SkillBox } from "./Doll";
import useLoadoutController from "@/utils/hooks/useLoadoutController";
import { Loadout, LoadoutType } from "@/src-tauri/bindings/rspc";
import Loading from "./Loading";
import { NeuralExpansion } from "@/src-tauri/bindings/enums";

type Props = {
  type: LoadoutType;
  data: Loadout | undefined;
};

const LoadoutContainer = ({ type, data }: Props) => {
  const { currentLoadout, goalLoadout, updateLoadout } =
    useContext(DbDollContext);
  // const { algo, neural, skill_level: slv } = data;
  // const control = useLoadoutController(updateCurrentUnit, type);

  function getValue(e: ChangeEvent<HTMLInputElement>): number {
    let value = parseInt(e.target.value);
    return value;
  }
  if (!data || !currentLoadout || !goalLoadout) return <Loading />;

  const loadout = type === "Current" ? currentLoadout : goalLoadout;

  return (
    <>
      <div className="flex items-center">
        <SkillBox
          // skill_level={}
          handleSlvChange={() => {}}
        />
        <LevelBox
          type={type}
          frags={loadout.frags}
          level={loadout.level}
          handleLevelChange={(e) =>
            updateLoadout({ ...loadout, level: getValue(e) }, type)
          }
          handleFragsChange={(e) =>
            updateLoadout({ ...loadout, frags: getValue(e) }, type)
          }
        />
        {data && (
          <RaritySelect
            value={data.neural as NeuralExpansion}
            onChange={(neural) => updateLoadout({ ...loadout, neural }, type)}
          />
        )}
      </div>
      {/* <AlgorithmSet algo={data?.algo} type={type} /> */}
    </>
  );
};

export default LoadoutContainer;
