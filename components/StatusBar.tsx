import { invoke } from "@tauri-apps/api/tauri";

type Props = {
  saveHandle: () => void;
  isSaveVisible: boolean;
};
const StatusBar = ({ saveHandle, isSaveVisible }: Props) => {
  // INFO: debug
  async function view_store_units() {
    let t = await invoke("view_store_units");
    console.warn("view_store_units");
    console.log(t);
  }
  return (
    <>
      {isSaveVisible ? (
        <button className="animate-pulse" onClick={() => saveHandle()}>
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
