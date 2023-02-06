import { Loadout } from "@/src-tauri/bindings/structs";
import { ChangeEvent } from "react";
import Skeleton from "react-loading-skeleton";

const LevelBox = ({
  data,
  handleLevelChange,
  handleFragsChange,
}: {
  data: Loadout | undefined;
  handleLevelChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFragsChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  // const { level, frags } = data;

  return (
    <div className="flex flex-grow-0 flex-col">
      <p>Level:</p>
      {data ? (
        <input
          type="number"
          value={data.level}
          min={1}
          max={70}
          onChange={handleLevelChange}
        />
      ) : (
        <Skeleton containerClassName="w-24" />
      )}
      {data ? (
        data.frags !== null && (
          <>
            <p>Neural Frags:</p>
            <input
              type="number"
              value={data.frags}
              min={0}
              max={999}
              onChange={handleFragsChange}
            />
          </>
        )
      ) : (
        <Skeleton containerClassName="w-24" />
      )}
    </div>
  );
};
export default LevelBox;
