import Label from "@/components/Form/Label";
import { LoadoutType } from "@/src-tauri/bindings/enums";
import { Loadout } from "@/src-tauri/bindings/structs";
import { ChangeEvent } from "react";
import Skeleton from "react-loading-skeleton";

type Props = {
  type: LoadoutType;
  data: Loadout | undefined;
  handleLevelChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFragsChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
const LevelBox = ({
  type,
  data,
  handleLevelChange,
  handleFragsChange,
}: Props) => {
  return (
    <div className="flex flex-grow-0 flex-col">
      {data ? (
        <>
          <Label
            label="Level"
            value={data.level}
            id={`unitLevel${type}`}
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
              id={`unitFrags${type}`}
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
