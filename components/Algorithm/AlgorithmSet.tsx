import {
  AlgoError,
  AlgoErrorContext,
  DollContext,
} from "@/interfaces/payloads";
import { useCallback, useContext } from "react";
import Loading from "../Loading";
import AlgorithmPiece from "./AlgorithmPiece";
import {
  AlgoMainStat,
  AlgoCategory,
  LoadoutType,
  Algorithm,
} from "@/src-tauri/bindings/enums";
import { AlgoPiece, AlgoSet } from "@/src-tauri/bindings/structs";
import { useAlgoDbQuery } from "@/utils/hooks/algo/useAlgoDbQuery";
import { useAlgoMainStatQuery } from "@/utils/hooks/algo/useAlgoMainStatQuery";
import { useNewAlgoMutation } from "@/utils/hooks/mutations/newAlgo";

type Props = {
  algo: AlgoSet;
  type: LoadoutType;
};
export type OptionPayload = {
  algoTypes: [AlgoCategory, Algorithm[]];
  mainStat: AlgoMainStat[];
};

const AlgorithmSet = ({ algo, type }: Props) => {
  const algoDbQuery = useAlgoDbQuery();
  const mainStatQuery = useAlgoMainStatQuery();
  const { setDollData } = useContext(DollContext);

  const algoError: AlgoError[] = useContext(AlgoErrorContext);
  const errList = (category: AlgoCategory): number[] => {
    // e: [ALGOCATEGORY, indexes[]]
    let find = algoError.find((e) => e[0] == category);
    if (find === undefined) return [];
    return find[1];
  };

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

  const handleUpdatePiece = useCallback((
    e: AlgoPiece | null,
    cat: AlgoCategory,
    index: number
  ): void => {
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
  }, [setDollData, type])

  if (algoDbQuery.isLoading || mainStatQuery.isLoading) return <Loading />;
  if (algoDbQuery.isError || mainStatQuery.isError) return <p>err</p>;
  const { data: mainStat } = mainStatQuery;
  const { data: algoDb } = algoDbQuery;

  if (algoDb.length > 0)
    return (
      <>
        <div className="setContainer">
          {algoDb
            .map((e) => e[0] as AlgoCategory)
            .map((category, catindex) => (
              <div
                className="flex min-w-fit shrink-0 basis-1/3 flex-col"
                key={catindex}
              >
                {algo[category.toLowerCase() as keyof AlgoSet].map(
                  (piece, pieceind) => (
                    <div key={pieceind} className="m-1">
                      <AlgorithmPiece
                        index={pieceind}
                        options={{
                          algoTypes: algoDb[catindex],
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
              category={algoDb[index][0]}
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
  const { newAlgorithmPiece } = useNewAlgoMutation(
    addHandler,
    category,
    loadout_type
  );
  const checkedSlots = loadout_type === "goal";

  return (
    <button onClick={() => newAlgorithmPiece({ category, checkedSlots })}>
      New {category} piece
    </button>
  );
};
