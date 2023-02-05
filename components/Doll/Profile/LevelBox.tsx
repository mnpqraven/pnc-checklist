import { Loadout } from "@/src-tauri/bindings/structs";
import { ChangeEvent } from "react";

const LevelBox = ({
  data,
  handleLevelChange,
  handleFragsChange,
}: {
  data: Loadout;
  handleLevelChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFragsChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const { level, frags } = data;

  return (
    <div className="flex flex-grow-0 flex-col">
      <p>Level:</p>
      <input
        type="number"
        value={level}
        min={1}
        max={70}
        onChange={handleLevelChange}
      />
      {frags != null ? (
        <>
          <p>Neural Frags:</p>
          <input
            type="number"
            value={frags}
            min={0}
            max={999}
            onChange={handleFragsChange}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
export default LevelBox
