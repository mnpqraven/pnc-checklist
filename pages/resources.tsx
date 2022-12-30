import { GrandResource } from '@/interfaces/datamodel';
import styles from '@/styles/Home.module.css'
import { invoke } from '@tauri-apps/api/tauri';
import { useEffect, useState } from 'react'
export default function Resources() {

  const [req, setReg] = useState<GrandResource>({slv_token: 0, slv_pivot: 0, coin: 0})
  async function get_req() {
    setReg(await invoke<GrandResource>('get_needed_rsc'));
  }

  async function view_store_units() {
    let t = await invoke('view_store_units');
    console.warn('view_store_units')
    console.log(t)
    await invoke('get_needed_rsc')
  }

  useEffect(() => {
    console.log('[mount] page resources')
    get_req();
  }, []);

  return (
    <>
      <main className={styles.main}>
        <h1>amount needed:</h1>
        <p>token: {req.slv_token}</p>
        <p>pivot: {req.slv_pivot}</p>
        <p>coin: {req.coin}</p>
        <button onClick={view_store_units}>show_storage_units</button>
      </main>
    </>
  )
}
