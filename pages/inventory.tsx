import { Algorithm } from "@/src-tauri/bindings/enums";
import { AlgoPiece, Unit } from "@/src-tauri/bindings/structs";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

const Inventory = () => {
  const [test, setTest] = useState<{ piece: string, unit: string }[]>([]);

  useEffect(() => {
    invoke<[AlgoPiece| null, Unit | null][]>("view_locker").then(e => {
      setTest(e.map(i => {
          return { piece: i[0] !== null ? i[0].name.toString() : "NULL",
          unit: i[1] !== null ? i[1].name : "NULL"}
        }))
    })
  }, []);
  return (
    <main>
      <p>inventory page</p>
      {test.map((e, index) =>
        <p key={index}>
          {e.piece.toString()} - [{e.unit}]
        </p>)}
    </main>
  );
};
export default Inventory;
