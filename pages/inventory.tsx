import {
  AlgoPiece,
  AlgorithmRequirement,
  AlgoSlot,
  Unit,
} from "@/src-tauri/bindings/structs";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import Image from "next/image";
import { algo_src } from "@/utils/helper";

const Inventory = () => {
  const [test, setTest] = useState<{ piece: string; unit: string }[]>([]);
  const [algoReq, setAlgoReq] = useImmer<AlgorithmRequirement[]>([]);

  function fetchLockerData() {
    invoke<[AlgoPiece | null, Unit | null][]>("view_locker").then((e) => {
      setTest(
        e.map(([algo, unit]) => {
          return {
            piece: algo !== null ? algo.name.toString() : "NULL",
            unit: unit !== null ? unit.name : "NULL",
          };
        })
      );
    });
  }

  useEffect(() => {
    fetchLockerData();
    // fetchAlgoReq();
    invoke<AlgorithmRequirement[]>("dev_algo").then(setAlgoReq);
  }, [setAlgoReq]);

  function deleteKeychain(index: number) {
    invoke("remove_kc", { index }).then(fetchLockerData);
  }

  async function clear_ownerless() {
    await invoke('clear_ownerless')
    fetchLockerData()
  }

  async function algo_req_is_empty(
    algoReq: AlgorithmRequirement
  ): Promise<boolean> {
    let val = await invoke<boolean>("algo_req_is_empty", { algoReq });
    return val;
  }

  const ReqItem = ({ algoReq }: { algoReq: AlgorithmRequirement }) => {
    const [hasReq, setHasReq] = useState(false);

    useEffect(() => {
      algo_req_is_empty(algoReq).then(setHasReq);
    }, [algoReq]);

    return hasReq ? (
      <fieldset>
        <legend>{algoReq.from_unit.name}</legend>
        <RequiredAlgo algos={algoReq.pieces} />
      </fieldset>
    ) : (
      <></>
    );
  };

  return (
    <main>
      <>
        <div className="flex">
          <p>current algos</p>
          <button onClick={clear_ownerless}>clear unused algorithms</button>
        </div>
        {test.map((e, index) => (
          <div key={index} className="flex flex-row">
            <button onClick={() => deleteKeychain(index)}>delete</button>
            <p>
              {e.piece.toString()} - [{e.unit}]
            </p>
          </div>
        ))}
        <p>required algos</p>
        {algoReq.map((item, index) => (
          <ReqItem algoReq={item} key={index} />
        ))}
        <button onClick={() => setAlgoReq([])}>clear</button>
      </>
    </main>
  );
};

const RequiredAlgo = ({ algos }: { algos: AlgoPiece[] }) => {
  const DisplaySlot = ({ slots }: { slots: AlgoSlot }) => {
    return (
      <div id="DisplaySlot" className="flex">
        {slots.map((slot, index) => (
          <div key={index}>
            <input type="checkbox" checked={slot} readOnly />
          </div>
        ))}
      </div>
    );
  };

  const hasReq = (algo: AlgoPiece): boolean => {
    for (const slot of algo.slot) {
      if (slot === true) return true;
    }
    return false;
  };

  return (
    <div id="RequiredAlgo" className="flex">
      {algos.map(
        (algo, index) =>
          hasReq(algo) && (
            <div key={index} className="flex">
              <div className="w-auto h-auto">
                <Image
                  src={algo_src(algo.name)}
                  alt={algo.name}
                  width={60}
                  height={60}
                  priority
                />
              </div>
              <div className="flex flex-col">
                <fieldset>
                  <legend>{algo.stat}</legend>
                  <DisplaySlot slots={algo.slot} />
                </fieldset>
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default Inventory;
