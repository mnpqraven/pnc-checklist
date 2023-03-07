import { AlgoCategory } from "@/src-tauri/bindings/enums";
import Loading from "../Loading";
import { useAlgoDbQuery } from "@/utils/hooks/algo/useAlgoDbQuery";
import { motion } from "framer-motion";
import { Backdrop } from "../Modal/Backdrop";
import ErrorContainer from "../Error";
import AlgoImage from "./AlgoImage";
import { Algorithm } from "@/src-tauri/bindings/rspc";

type Props = {
  handleClose: () => void;
  category: AlgoCategory;
  onSelect: (algo: Algorithm) => void;
  current: Algorithm;
};
const PieceModal = ({
  handleClose,
  category,
  onSelect: selectAlgo,
  current,
}: Props) => {
  const algoDb = useAlgoDbQuery();

  if (algoDb.isLoading) return <Loading />;
  if (algoDb.isError) return <ErrorContainer />;
  // [ ['offense', algo[]], ['stability', algo[]] ]
  const [_, algos]: [AlgoCategory, Algorithm[]] = algoDb.data.filter(
    (item) => item[0] == category
  )[0];

  const onClick = (algo: Algorithm) =>
    algo !== current ? selectAlgo(algo) : {};

  return (
    <>
      <motion.div
        className="modal grid grid-cols-4 place-items-center"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {algos.map((algo, index) => (
          <motion.div
            className={algo != current ? "cursor-pointer" : "opacity-50"}
            key={index}
            onClick={() => onClick(algo)}
            initial={{ scale: 0.9 }}
            whileHover={{ scale: 1.0 }}
            whileTap={{ scale: 0.8 }}
          >
            <AlgoImage algo={algo} />
          </motion.div>
        ))}
      </motion.div>
      <Backdrop onClick={handleClose} />
    </>
  );
};
export default PieceModal;
