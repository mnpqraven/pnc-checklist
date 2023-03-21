import { ChangeEvent, useContext, useEffect, useState } from "react";
import { OptionPayload } from "./AlgorithmSet";
import { DbDollContext } from "@/interfaces/payloads";
import {
  AlgoImage,
  PieceModal,
  SlotCheckbox,
} from "@/components/Algorithm/Common";
import { AnimatePresence, motion } from "framer-motion";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  AlgoCategory,
  AlgoMainStat,
  AlgoPiece,
  Algorithm,
  Class,
} from "@/src-tauri/bindings/rspc";
import { invoke } from "@tauri-apps/api/tauri";
import { IVK } from "@/src-tauri/bindings/invoke_keys";
import { rspc } from "../Providers/ClientProviders";
import { Button, MainStatSelect } from "@/components/Common";
import { getLabel, parseAlgoName } from "@/utils/helper";

type Props = {
  pieceData: AlgoPiece;
  options: OptionPayload;
  category: AlgoCategory;
  valid: boolean | undefined;
  loadoutId: string;
};

const AlgorithmPiece = ({
  pieceData,
  options,
  category,
  valid,
  loadoutId,
}: Props) => {
  const { currentUnit, algoPiece, slot } = useContext(DbDollContext);
  const { mutate } = rspc.useMutation(["algoPiece.deleteById"]);
  const [algorithm, setAlgorithm] = useState(pieceData.name);
  const [mainStat, setMainStat] = useState(pieceData.stat);
  const [openModal, setModal] = useState(false);
  const { data: enumAlgos } = rspc.useQuery(["enum.Algorithm"]);

  const [componentSize, setComponentSize] = useState(2);

  async function updateComponentSize(algo: Algorithm) {
    invoke<number>(IVK.ALGO_GET_SLOT_SIZE, { algo }).then(setComponentSize);
  }

  // chaging unit
  useEffect(() => {
    setAlgorithm(pieceData.name);
    updateComponentSize(pieceData.name as Algorithm);
    setMainStat(pieceData.stat);
  }, [pieceData]);

  function pieceHandler(to: Algorithm) {
    if (enumAlgos) {
      let piece = { ...pieceData, name: to };
      algoPiece.updateData(piece, loadoutId);
      setModal(false);
    }
  }

  function mainStatHandler(event: ChangeEvent<HTMLSelectElement> | string) {
    let stat: AlgoMainStat = "Atk";
    if (typeof event === "string") stat = event as AlgoMainStat;
    else stat = event.currentTarget.value as AlgoMainStat;

    let nextPiece = { ...pieceData, stat };
    // setPiece(nextPiece);
    setMainStat(stat);

    algoPiece.updateData(nextPiece, loadoutId);
  }

  function deleteAlgoPiece(algoPieceId: string) {
    mutate(algoPieceId, {
      onSuccess: () => [algoPiece, slot].forEach((e) => e.refetch()),
    });
  }

  return (
    <motion.div
      id="algo-piece"
      className={`m-1 flex items-center justify-center
        ${valid === false ? `border border-red-500` : ``} `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence initial={false} mode="wait">
        {openModal && (
          <PieceModal
            current={pieceData.name as Algorithm}
            handleClose={() => setModal(false)}
            category={category}
            onSelect={pieceHandler}
          />
        )}
      </AnimatePresence>
      <div className="mx-2 cursor-pointer">
        <AlgoImage
          algo={algorithm as Algorithm}
          onClick={() => setModal(!openModal)}
        />
      </div>
      <div className="flex max-w-[10rem] grow flex-col gap-2">
        <MainStatSelect
          value={mainStat}
          options={options.mainStat}
          onChangeHandler={mainStatHandler}
          category={category}
        />
        <div className="flex flex-row items-center justify-between">
          {currentUnit ? (
            <SlotCheckbox
              pieceId={pieceData.id}
              unitClass={currentUnit.class as Class}
              category={category}
              componentSize={componentSize}
            />
          ) : null}
          <Button
            className="small red"
            onClick={() => deleteAlgoPiece(pieceData.id)}
          >
            <TrashIcon />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
export default AlgorithmPiece;
