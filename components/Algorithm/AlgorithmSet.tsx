import {
  AlgoError,
  AlgoErrorContext,
  DollContext,
} from "@/interfaces/payloads";
import {
  AlgoCategory,
  AlgoMainStat,
  Algorithm,
  LoadoutType,
} from "@/src-tauri/bindings/enums";
import { AlgoPiece, AlgoSet } from "@/src-tauri/bindings/structs";
import { useAlgoDbQuery } from "@/utils/hooks/algo/useAlgoDbQuery";
import { useMainStatsQuery } from "@/utils/hooks/algo/useAlgoMainStatQuery";
import { useNewAlgoMutation } from "@/utils/hooks/mutations/newAlgo";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import Button from "../Button";
import ErrorContainer from "../Error";
import AlgorithmPiece from "./AlgorithmPiece";

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
  const mainStatQuery = useMainStatsQuery();
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
  if (algoDbQuery.isLoading || mainStatQuery.isLoading) return null;
  if (algoDbQuery.isError || mainStatQuery.isError) return <ErrorContainer />;

  const { data: algoDb } = algoDbQuery;
  const { data: mainStat } = mainStatQuery;

  return (
    <div className="flex flex-none flex-col">
      <div className="flex">
        {algoDbQuery.data && algo ? (
          algoDbQuery.data
            .map((e) => e[0] as AlgoCategory)
            .map((category, catindex) => (
              <div
                className="my-2 flex shrink-0 basis-1/3 flex-col"
                key={catindex}
              >
                {algo[category.toLowerCase() as keyof AlgoSet].map(
                  (piece, pieceind) => (
                    <AlgorithmPiece
                      key={pieceind}
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
                  )
                )}
              </div>
            ))
        ) : (
          <LoadingAlgoSet />
        )}
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
    </div>
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
    <Button onClick={() => newAlgorithmPiece({ category, checkedSlots })}>
      New {category} piece
    </Button>
  );
};

const LoadingAlgoSet = () => {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        className="inline-flex w-full"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {[0, 1, 2].map((ind) => (
          <div key={ind} className="m-2 flex h-[61px] flex-grow">
            <Skeleton circle height={56} width={56} />
            <div className="flex flex-grow flex-col">
              <Skeleton containerClassName="flex-grow mx-4" height={22} />
              <Skeleton containerClassName="flex-grow mx-4" height={22} />
            </div>
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
