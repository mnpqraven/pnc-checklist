import { Unit } from "@/src-tauri/bindings/structs";
import useSaveUnitsMutation from "@/utils/hooks/mutations/saveUnits";
import { invoke } from "@tauri-apps/api/tauri";

type Props = {
  dirtyUnits: Unit[];
  isSaveVisible: boolean;
};
const StatusBar = ({ dirtyUnits, isSaveVisible }: Props) => {
  const { saveUnits } = useSaveUnitsMutation();
  return (
    <>
      <button
        disabled={!isSaveVisible}
        className={isSaveVisible ? `animate-pulse` : `opacity-40`}
        onClick={() => saveUnits(dirtyUnits)}
      >
        Save changes
      </button>
    </>
  );
};
export default StatusBar;
