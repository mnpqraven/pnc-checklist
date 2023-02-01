import {
  AlgoError,
  AlgoErrorContext,
  DollContext,
} from "@/interfaces/payloads";
import { invoke } from "@tauri-apps/api/tauri";
import { useState, useEffect, useContext } from "react";
import Loading from "../Loading";
import AlgorithmPiece from "./AlgorithmPiece";
import styles from "../../styles/Page.module.css";
import {
  AlgoMainStat,
  AlgoCategory,
  LoadoutType,
  Algorithm,
} from "@/src-tauri/bindings/enums";
import { AlgoPiece, AlgoSet } from "@/src-tauri/bindings/structs";

type Props = {
  algo: AlgoSet;
  type: LoadoutType;
};
export type OptionPayload = {
  algoTypes: [AlgoCategory, Algorithm[]];
  mainStat: AlgoMainStat[];
};

const AlgorithmSet = ({ algo, type }: Props) => {
  const [algoTypes, setAlgoTypes] = useState<[AlgoCategory, Algorithm[]][]>([]);
  const [mainStat, setMainStat] = useState<AlgoMainStat[][]>([]);
  const algoError: AlgoError[] = useContext(AlgoErrorContext);

  const errList = (category: AlgoCategory): number[] => {
    // e: [ALGOCATEGORY, indexes[]]
    let find = algoError.find((e) => e[0] == category);
    if (find === undefined) return [];
    return find[1];
  };

  useEffect(() => {
    async function get_algo_types() {
      setAlgoTypes(
        await invoke<[AlgoCategory, Algorithm[]][]>("generate_algo_db")
      );
      let mainstats = await invoke<AlgoMainStat[][]>("main_stat_all");
      setMainStat(mainstats);
    }
    get_algo_types();

    for (const cat in algo) {
      console.warn(cat);
    }
  }, []);

  const { setDollData } = useContext(DollContext);

  function handleAddPiece(
    e: AlgoPiece,
    cat: AlgoCategory,
    loadout: LoadoutType
  ): void {
    if (setDollData)
      setDollData((draft) => {
        if (draft)
          draft[loadout].algo[cat.toLowerCase() as keyof AlgoSet].push(e);
      });
  }

  function handleUpdatePiece(
    e: AlgoPiece | null,
    cat: AlgoCategory,
    index: number
  ): void {
    if (setDollData && e)
      setDollData((draft) => {
        if (draft)
          draft[type].algo[cat.toLowerCase() as keyof AlgoSet][index] = e;
      });
    else if (setDollData)
      // no piece passed, deletion
      setDollData((draft) => {
        if (draft)
          draft[type].algo[cat.toLowerCase() as keyof AlgoSet].splice(index, 1);
      });
  }

  if (algoTypes.length > 0)
    return (
      <>
        <div className={styles.setContainer}>
          {algoTypes
            .map((e) => e[0] as AlgoCategory)
            .map((category, catindex) => (
              <div className={styles.algocategory} key={catindex}>
                {algo[category.toLowerCase() as keyof AlgoSet].map(
                  (piece, pieceind) => (
                    <div key={pieceind} className="m-1">
                      <AlgorithmPiece
                        index={pieceind}
                        options={{
                          algoTypes: algoTypes[catindex],
                          mainStat: mainStat[catindex],
                        }}
                        category={category}
                        pieceData={piece}
                        valid={!errList(category).includes(pieceind)}
                        onChange={handleUpdatePiece}
                      />
                    </div>
                  )
                )}
              </div>
            ))}
        </div>

        <div className="flex flex-row justify-around">
          {[0, 1, 2].map((index) => (
            <NewAlgoSet
              key={index}
              category={algoTypes[index][0]}
              loadout_type={type}
              addHandler={handleAddPiece}
            />
          ))}
        </div>
      </>
    );

  return <Loading />;
};
export default AlgorithmSet;

type NewAlgoSetProps = {
  category: AlgoCategory;
  loadout_type: LoadoutType;
  addHandler: (
    value: AlgoPiece,
    category: AlgoCategory,
    loadout_type: LoadoutType
  ) => void;
};

const NewAlgoSet = ({
  category,
  loadout_type,
  addHandler,
}: NewAlgoSetProps) => {
  const { dollData, setDollData } = useContext(DollContext);
  const defined = dollData && setDollData;

  async function new_algo_set(
    category: AlgoCategory,
    loadout_type: LoadoutType
  ) {
    if (defined) {
      let checkedSlots = loadout_type === "goal" ? true : false;
      let t = await invoke<AlgoPiece>("algo_piece_new", {
        category,
        checkedSlots,
      });
      addHandler(t, category, loadout_type);
    }
  }

  return (
    <button onClick={() => new_algo_set(category, loadout_type)}>
      New {category} algorithm
    </button>
  );
};
