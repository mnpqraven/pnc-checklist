import { AlgoCategory, Algorithm } from "@/src-tauri/bindings/enums";
import Loading from "../Loading";
import Image from "next/image";
import { algo_src } from "@/utils/helper";
import { useAlgoDbQuery } from "@/utils/hooks/algo/useAlgoDbQuery";

type Props = {
  open: boolean;
  onLeave: () => void;
  category: AlgoCategory;
  onSelect: (algo: Algorithm) => void;
};
const PieceModal = ({ open, onLeave, category, onSelect: selectAlgo }: Props) => {
  const algoDb = useAlgoDbQuery();

  if (algoDb.isLoading) return <Loading />;
  if (algoDb.isError) return <p>error</p>;
  // [ ['offense', algo[]], ['stability', algo[]] ]
  const [_, algos]: [AlgoCategory, Algorithm[]] = algoDb.data.filter(
    (item) => item[0] == category
  )[0];

  if (open)
    return (
      <div
        className="modal-overlay grid grid-cols-4 flex-wrap justify-around content-around"
        onMouseLeave={onLeave}
      >
        {algos.map((algo, index) => (
          <div
            className="cursor-pointer flex flex-col align-middle"
            key={index}
            onClick={() => selectAlgo(algo)}
          >
            <Image src={algo_src(algo)} alt={algo} width={60} height={60} />
          </div>
        ))}
      </div>
    );
  return null;
};
export default PieceModal;
