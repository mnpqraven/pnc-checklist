import {
  AlgoError,
  AlgoErrorContext,
  DollContext,
} from "@/interfaces/payloads";
import { invoke } from "@tauri-apps/api/tauri";
import { useState, useEffect, useContext } from "react";
import Loading from "../Loading";
import AlgorithmPiece from "./AlgorithmPiece";
import styles from "@/styles/Page.module.css";
import { AlgoMainStat } from "@/src-tauri/bindings/enums/AlgoMainStat";
import { AlgoCategory } from "@/src-tauri/bindings/enums/AlgoCategory";
import { AlgoPiece } from "@/src-tauri/bindings/structs/AlgoPiece";
import { AlgoSet } from "@/src-tauri/bindings/structs/AlgoSet";
import { AlgoTypeDb } from "@/src-tauri/bindings/structs/AlgoTypeDb";
import { LoadoutType } from "@/src-tauri/bindings/enums/LoadoutType";

type Props = {
  algo: AlgoSet;
  type: LoadoutType;
};
export type OptionPayload = {
  algoTypes: AlgoTypeDb;
  mainStat: AlgoMainStat[];
};
const AlgorithmSet = ({ algo, type }: Props) => {
  const [algoTypes, setAlgoTypes] = useState<AlgoTypeDb[]>([]);
  const [mainStat, setMainStat] = useState<AlgoMainStat[]>([]);
  const [ALGOCATEGORY, setALGOCATEGORY] = useState<string[]>([])

  const algoError: AlgoError[] = useContext(AlgoErrorContext);
  const errList = (category: AlgoCategory): number[] => {
    // e: [ALGOCATEGORY, indexes[]]
    let find = algoError.find((e) => e[0] == category);
    if (find === undefined) return [];
    return find[1];
  };

  useEffect(() => {
    invoke<string[]>('enum_ls', {name: 'AlgoCategory'}).then(setALGOCATEGORY)
    async function get_algo_types() {
      setAlgoTypes(await invoke<AlgoTypeDb[]>("get_algo_types"));
      setMainStat(await invoke<AlgoMainStat[]>("main_stat_all"));
    }
    get_algo_types();
  }, []);

  const { setDollData } = useContext(DollContext)

  function handleAddPiece(e: AlgoPiece, cat: AlgoCategory, loadout: LoadoutType): void {
    if (setDollData)
      setDollData((draft) => {
        if (draft) draft[loadout].algo[cat.toLowerCase() as keyof AlgoSet].push(e)
      })
  }
  function handleUpdatePiece(e: AlgoPiece | null, cat: AlgoCategory, index: number): void {
    if (setDollData) {
      if (e) {
        setDollData((draft) => {
          if (draft) draft[type].algo[cat.toLowerCase() as keyof AlgoSet][index] = e
        })
      } else {
        // no piece passed, deletion
        setDollData((draft) => {
          if (draft) draft[type].algo[cat.toLowerCase() as keyof AlgoSet].splice(index, 1)
        })
      }
    }
  }

  return (
    <>
      <div className="flex">
        <div className={styles.algocategory}>
          {algoTypes[0] !== undefined ? (
            algo.offense.map((piece, index) => (
              <div key={`offense-${index}`} className="m-1">
                <AlgorithmPiece
                  index={index}
                  options={{ algoTypes: algoTypes[0], mainStat }}
                  category={"Offense"}
                  pieceData={piece}
                  valid={!errList("Offense").includes(index)}
                  onChange={handleUpdatePiece}
                />
              </div>
            ))
          ) : (
            <Loading />
          )}
        </div>

        <div className="mx-2" />

        <div className={`${styles.algocategory} ${styles.list}`}>
          {algoTypes[1] !== undefined ? (
            algo.stability.map((piece, index) => (
              <div key={`stability-${index}`} className="m-1">
                <AlgorithmPiece
                  index={index}
                  options={{ algoTypes: algoTypes[1], mainStat }}
                  category={"Stability"}
                  pieceData={piece}
                  valid={!errList("Stability").includes(index)}
                  onChange={handleUpdatePiece}
                />
              </div>
            ))
          ) : (
            <Loading />
          )}
        </div>

        <div className="mx-2" />

        <div className={`${styles.algocategory} ${styles.list}`}>
          {algoTypes[2] !== undefined ? (
            algo.special.map((piece, index) => (
              <div key={`special-${index}`} className="m-1">
                <AlgorithmPiece
                  index={index}
                  options={{ algoTypes: algoTypes[2], mainStat }}
                  category={"Special"}
                  pieceData={piece}
                  valid={!errList("Special").includes(index)}
                  onChange={handleUpdatePiece}
                />
              </div>
            ))
          ) : (
            <Loading />
          )}
        </div>
      </div>
      <div className="flex flex-row justify-around">
        <NewAlgoSet category={ALGOCATEGORY[0] as AlgoCategory} loadout_type={type} addHandler={handleAddPiece} />
        <NewAlgoSet category={ALGOCATEGORY[1] as AlgoCategory} loadout_type={type} addHandler={handleAddPiece} />
        <NewAlgoSet category={ALGOCATEGORY[2] as AlgoCategory} loadout_type={type} addHandler={handleAddPiece} />
      </div>
    </>
  );
};
export default AlgorithmSet;

const NewAlgoSet = ({
  category,
  loadout_type,
  addHandler
}: {
  category: AlgoCategory;
  loadout_type: LoadoutType;
  addHandler: (value: AlgoPiece, category: AlgoCategory, loadout_type: LoadoutType) => void
}) => {
  const { dollData, setDollData  } = useContext(DollContext);
  const defined = dollData && setDollData;
  async function new_algo_set(
    category: AlgoCategory,
    loadout_type: LoadoutType
  ) {
    if (defined) {
      let t = await invoke<AlgoPiece>("algo_piece_new", { category });
      addHandler(t, category, loadout_type);
    }
  }
  return (
    <button onClick={() => new_algo_set(category, loadout_type)}>
      New {category} algorithm
    </button>
  );
};
