import { Unit } from "@/src-tauri/bindings/structs";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

const Inventory = () => {
  const [test, setTest] = useState<string[]>([]);

  useEffect(() => {
    invoke<Unit[]>("view_locker").then(e => {
      setTest(e.map(i => i.name))
    })
  }, []);
  return (
    <main>
      <p>inventory page</p>
      {test.map((e, index) =>
        <p key={index}>
          {e}
        </p>)}
    </main>
  );
};
export default Inventory;
