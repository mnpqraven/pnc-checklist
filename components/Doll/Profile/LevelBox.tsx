import Label from "@/components/Form/Label";
import { LoadoutType } from "@/src-tauri/bindings/rspc";
import { ChangeEvent } from "react";
import Skeleton from "react-loading-skeleton";

type Props = {
  type: LoadoutType;
  frags: number | null;
  level: number;
  handleLevelChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFragsChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
const LevelBox = ({
  type,
  frags,
  level,
  handleLevelChange,
  handleFragsChange,
}: Props) => {
  return (
    <div className="flex flex-grow-0 flex-col">
      {level ? (
        <>
          <Label
            label="Level"
            value={level}
            id={`unitLevel${type}`}
            onChange={handleLevelChange}
            type="number"
            min={1}
            max={70}
            flex="col"
          />
          {frags !== null && (
            <Label
              label="Neural Frags"
              type="number"
              value={frags}
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
