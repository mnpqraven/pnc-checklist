import {
  AlgoError,
  AlgoErrorContext,
  DollContext,
} from "@/interfaces/payloads";
import { useCallback, useContext, useState } from "react";
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
import { AnimatePresence, motion } from "framer-motion";
import ErrorContainer from "../Error";
import Skeleton from "react-loading-skeleton";

type Props = {
  algo: AlgoSet | undefined;
  type: LoadoutType;
};
export type OptionPayload = {
  algoTypes: [AlgoCategory, Algorithm[]];
  mainStat: AlgoMainStat[];
};

const AlgorithmSet = ({ algo, type }: Props) => {
  const cats: AlgoCategory[] = ["Offense", "Stability", "Special"];
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

  const handleUpdatePiece = useCallback(
    (e: AlgoPiece | null, cat: AlgoCategory, index: number): void => {
      if (setDollData && e)
        setDollData((draft) => {
          if (draft)
            draft[type].algo[cat.toLowerCase() as keyof AlgoSet][index] = e;
        });
      else if (setDollData)
        // no piece passed, deletion
        setDollData((draft) => {
          if (draft)
            draft[type].algo[cat.toLowerCase() as keyof AlgoSet].splice(
              index,
              1
            );
        });
    },
    [setDollData, type]
  );

  // if (algoDbQuery.isLoading || mainStatQuery.isLoading) return null;
  if (mainStatQuery.isLoading) return null;
  if (algoDbQuery.isError || mainStatQuery.isError) return <ErrorContainer />;

  const { data: mainStat } = mainStatQuery;
  // const { data: algoDb } = algoDbQuery;

  return (
    <>
      <div className="inline-flex w-full justify-between">
        {
          algoDbQuery.data &&
            algo &&
            algoDbQuery.data
              .map((e) => e[0] as AlgoCategory)
              .map((category, catindex) => (
                <div
                  className="my-2 flex min-w-fit shrink-0 basis-1/3 flex-col"
                  key={catindex}
                >
                  <AnimatePresence mode="sync">
                    {algo[category.toLowerCase() as keyof AlgoSet].map(
                      (piece, pieceind) => (
                        <motion.div
                          key={pieceind}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <AlgorithmPiece
                            index={pieceind}
                            options={{
                              algoTypes: algoDbQuery.data[catindex],
                              mainStat: mainStat[catindex],
                            }}
                            category={category}
                            pieceData={piece}
                            valid={!errList(category).includes(pieceind)}
                            onChange={handleUpdatePiece}
                          />
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
                </div>
              ))
          // : ( <LoadingAlgoSet />)
        }
      </div>

      <div className="flex flex-row justify-around">
        {cats.map((cat, index) => (
          <NewAlgoSet
            key={index}
            category={cat}
            loadout_type={type}
            addHandler={handleAddPiece}
          />
        ))}
      </div>
    </>
  );
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

const LoadingAlgoSet = () => {
  return (
    <>
      {[0, 1, 2].map((ind) => (
        <div key={ind} className="m-2 flex h-[61px] flex-grow">
          <Skeleton circle height={56} width={56} />
          <div className="flex flex-grow flex-col">
            <Skeleton containerClassName="flex-grow mx-4" height={22} />
            <Skeleton containerClassName="flex-grow mx-4" height={22} />
          </div>
        </div>
      ))}
    </>
  );
};
