import { AlgoPiece, KeychainTable, Unit } from "@/src-tauri/bindings/structs";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";
import { useImmer } from "use-immer";

const Inventory = () => {
  const [keychainItem, setKeychainItem] = useImmer<
    { owner: Unit; algo: AlgoPiece }[]
  >([]);

  useEffect(() => {
    invoke<[Unit, AlgoPiece][]>("view_locker").then((e) => {
      let t: { algo: AlgoPiece; owner: Unit }[] = e.map((t) => {
        return { owner: t[0], algo: t[1] };
      });
      setKeychainItem(t);
    });
  }, [setKeychainItem]);
  return (
    <main>
      <p>inventory page</p>
      {keychainItem.map(item => {
        return <>
        <p>{item.algo.name} - [{item.owner.name}]</p>
        </>
       })}
    </main>
  );
};
export default Inventory;
