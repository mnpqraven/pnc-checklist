import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";

const Inventory = () => {
  async function debug() {
    await invoke('view_inv_table').then(console.log)
  }
  return (
    <>
      <p>inventory page</p>
      <button
      onClick={debug}
      >view_store_units</button>
    </>
  );
};
export default Inventory;
