import {
  AlgoError,
  AlgoErrorContext,
  DbDollContext,
} from "@/interfaces/payloads";
import {
  AlgoCategory,
  AlgoMainStat,
  AlgoPiece,
  LoadoutType,
  Algorithm,
} from "@/src-tauri/bindings/rspc";
import { useAlgoDbQuery } from "@/utils/hooks/algo/useAlgoDbQuery";
import { useMainStatsQuery } from "@/utils/hooks/algo/useAlgoMainStatQuery";
import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { Button, ErrorContainer, Loading } from "@/components/Common";
import { rspc } from "../Providers/ClientProviders";
import AlgorithmPiece from "./AlgorithmPiece";

type Props = {
  algos: AlgoPiece[];
  type: LoadoutType;
  loadoutId: string;
};
export type OptionPayload = {
  algoTypes: [AlgoCategory, Algorithm[]];
  mainStat: AlgoMainStat[];
};

const AlgorithmSet = ({ algos, type, loadoutId }: Props) => {
  const cats: AlgoCategory[] = ["Offense", "Stability", "Special"];
  const algoDbQuery = useAlgoDbQuery();
  const mainStatQuery = useMainStatsQuery();

  if (algoDbQuery.isLoading || mainStatQuery.isLoading) return <Loading />;
  if (algoDbQuery.isError || mainStatQuery.isError) return <ErrorContainer />;

  return (
    <div className="flex flex-none flex-col">
      <div className="flex">
        {algos ? (
          cats.map((category, catindex) => (
            <CategoryContainer
              key={catindex}
              category={category}
              algos={algos}
              options={{
                algoTypes: algoDbQuery.data[catindex],
                mainStat: mainStatQuery.data[catindex],
              }}
              loadoutId={loadoutId}
            />
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
            loadoutType={type}
            loadoutId={loadoutId}
          />
        ))}
      </div>
    </div>
  );
};

type CategoryContainerProps = {
  category: AlgoCategory;
  algos: AlgoPiece[];
  options: OptionPayload;
  loadoutId: string;
};
const CategoryContainer = ({
  category,
  algos,
  options,
  loadoutId,
}: CategoryContainerProps) => {
  const algoError: AlgoError[] = useContext(AlgoErrorContext);
  const errList = (category: AlgoCategory): number[] => {
    // e: [ALGOCATEGORY, indexes[]]
    let find = algoError.find((e) => e[0] == category);
    if (find === undefined) return [];
    return find[1];
  };

  return (
    <div className="my-2 flex shrink-0 basis-1/3 flex-col">
      {algos
        .filter((e) => e.category == category)
        .map((piece, pieceind) => (
          <AlgorithmPiece
            key={pieceind}
            options={options}
            category={category}
            pieceData={piece}
            valid={!errList(category).includes(pieceind)}
            loadoutId={loadoutId}
          />
        ))}
    </div>
  );
};
export default AlgorithmSet;

type NewAlgoSetProps = {
  category: AlgoCategory;
  loadoutType: LoadoutType;
  loadoutId: string;
};

const NewAlgoSet = ({ category, loadoutType, loadoutId }: NewAlgoSetProps) => {
  const { algoPiece, slot } = useContext(DbDollContext);
  const mutation = rspc.useMutation(["algoPiece.new"]);

  function newAlgorithmPiece() {
    mutation.mutate([loadoutId, category, loadoutType === "Goal"], {
      onSuccess: () => [algoPiece, slot].forEach((e) => e.refetch()),
    });
  }

  return <Button onClick={newAlgorithmPiece}>New {category} piece</Button>;
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
