import { useContext } from "react";
import { DbDollContext } from "@/interfaces/payloads";
import { LevelBox, RaritySelect, SkillBox } from "./Doll";
import { Loadout, LoadoutType, NeuralExpansion } from "@/src-tauri/bindings/rspc";
import Loading from "./Loading";
import AlgorithmSet from "./Algorithm/AlgorithmSet";
import { getValue } from "@/utils/helper";

type Props = {
  type: LoadoutType;
  data: Loadout | undefined;
};

const LoadoutContainer = ({ type, data }: Props) => {
  const { loadout, algoPiece } = useContext(DbDollContext);

  if (!data || !algoPiece) return <Loading />;

  const currentLoadout = loadout.data.find((e) => e.loadoutType == type)!;
  const algoSet = algoPiece.data.filter((e) => e.loadoutId == data.id);

  return (
    <>
      <div className="flex items-center">
        <SkillBox loadoutId={data.id} />
        <LevelBox
          type={type}
          frags={currentLoadout.frags}
          level={currentLoadout.level}
          handleLevelChange={(e) =>
            loadout.updateData({ ...currentLoadout, level: getValue(e) }, type)
          }
          handleFragsChange={(e) =>
            loadout.updateData({ ...currentLoadout, frags: getValue(e) }, type)
          }
        />
        {data && (
          <RaritySelect
            value={data.neural as NeuralExpansion}
            onChange={(neural) =>
              loadout.updateData({ ...currentLoadout, neural }, type)
            }
          />
        )}
      </div>
      <AlgorithmSet algos={algoSet} type={type} loadoutId={currentLoadout.id} />
    </>
  );
};

export default LoadoutContainer;
