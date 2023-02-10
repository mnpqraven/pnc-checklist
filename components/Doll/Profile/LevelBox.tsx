import Label from "@/components/Form/Label";
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
  return (
    <div className="flex flex-grow-0 flex-col">
      {data ? (
        <>
          <Label
            label="Level"
            value={data.level}
            id="unitLevel"
            onChange={handleLevelChange}
            type="number"
            min={1}
            max={70}
            flex="col"
          />
          {data.frags !== null && (
            <Label
              label="Neural Frags"
              type="number"
              value={data.frags}
              id="unitFrags"
              onChange={handleFragsChange}
              min={0}
              max={999}
              flex="col"
            />
          )}
        </>
      ) : (
        <Skeleton containerClassName="w-24" count={4} />
      )}
    </div>
  );
};
export default LevelBox;
