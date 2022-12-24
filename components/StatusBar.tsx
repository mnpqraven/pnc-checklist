import { Unit } from "@/interfaces"
import { invoke } from "@tauri-apps/api/tauri"

type Props = {
  saveHandle: () => void
}
const StatusBar = ({ saveHandle }: Props) => {
  // INFO: debug
  async function view_store_units() {
    let t = await invoke('view_store_units');
    console.warn('view_store_units')
    console.log(t)
  }
  return (
    <>
      <p>status bar</p>
      <button onClick={() => saveHandle()}>update changes</button>
      <button onClick={() => view_store_units()}>show_storage_units</button>
    </>
  )
}
export default StatusBar
