import { Unit } from "@/src-tauri/bindings/structs";
import useSaveUnitsMutation from "@/utils/hooks/mutations/saveUnits";
import { invoke } from "@tauri-apps/api/tauri";

type Props = {
  dirtyUnits: Unit[];
  isSaveVisible: boolean;
};
const StatusBar = ({ dirtyUnits, isSaveVisible }: Props) => {
  // INFO: debug
  async function view_store_units() {
    let t = await invoke("view_store_units");
    console.warn("view_store_units");
    console.log(t);
  }

  const { saveUnits } = useSaveUnitsMutation();
  return (
    <>
      {isSaveVisible ? (
        <button className="animate-pulse" onClick={() => saveUnits(dirtyUnits)}>
          update changes
        </button>
      ) : (
        <></>
      )}
      <button onClick={() => view_store_units()}>show_storage_units</button>
    </>
  );
};
export default StatusBar;
