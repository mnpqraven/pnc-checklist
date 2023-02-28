import { ChangeEvent, useContext } from "react";
import { DbDollContext } from "@/interfaces/payloads";
import { LevelBox, RaritySelect, SkillBox } from "./Doll";
import { Loadout, LoadoutType } from "@/src-tauri/bindings/rspc";
import Loading from "./Loading";
import { NeuralExpansion } from "@/src-tauri/bindings/enums";
import AlgorithmSet from "./Algorithm/AlgorithmSet";
import { getValue } from "@/utils/helper";

type Props = {
  type: LoadoutType;
  data: Loadout | undefined;
};

const LoadoutContainer = ({ type, data }: Props) => {
  const { currentLoadout, goalLoadout, updateLoadout } =
    useContext(DbDollContext);
  // const { algo, neural, skill_level: slv } = data;
  // const control = useLoadoutController(updateCurrentUnit, type);

  const { algoPieces } = useContext(DbDollContext);

  if (!data || !algoPieces || !currentLoadout || !goalLoadout) return <Loading />;

  const loadout = type === "Current" ? currentLoadout : goalLoadout;

  return (
    <>
      <div className="flex items-center">
        <SkillBox loadoutId={data.id} />
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
      <AlgorithmSet algos={algoPieces} type={type} />
    </>
  );
};

export default LoadoutContainer;
