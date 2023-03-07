import { ChangeEvent, useContext, useEffect, useState } from "react";
import { OptionPayload } from "./AlgorithmSet";
import SlotCheckbox from "./SlotCheckbox";
import { invoke } from "@tauri-apps/api/tauri";
import { DbDollContext } from "@/interfaces/payloads";
import { AlgoSlot } from "@/src-tauri/bindings/structs";
import {
  AlgoCategory,
  AlgoMainStat,
  SlotPlacement,
} from "@/src-tauri/bindings/enums";
import PieceModal from "./PieceModal";
import { AnimatePresence, motion } from "framer-motion";
import MainStatSelect from "../MainstatSelect";
import { TrashIcon } from "@radix-ui/react-icons";
import AlgoImage from "./AlgoImage";
import { useComputeSlotsMutation } from "@/utils/hooks/mutations/computeSlots";
import { useImmer } from "use-immer";
import { Slot } from "@/src-tauri/bindings/structs/Slot";
import { useEnumTable } from "@/utils/hooks/useEnumTable";
import { ENUM_TABLE } from "@/src-tauri/bindings/ENUM_TABLE";
import Button from "../Button";
import { IVK } from "@/src-tauri/bindings/invoke_keys";
import { AlgoPiece, Algorithm, Class } from "@/src-tauri/bindings/rspc";
import { parseAlgoName } from "@/utils/helper";

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
  const { currentUnit, updatePiece, slots } = useContext(DbDollContext);
  const [algorithm, setAlgorithm] = useState(pieceData.name);
  const [mainStat, setMainStat] = useState(pieceData.stat);
  const [slot, setSlot] = useImmer<AlgoSlot>([]);
  const [piece, setPiece] = useState<AlgoPiece | null>(pieceData);
  const [openModal, setModal] = useState(false);

  const { mutate: updateSlots } = useComputeSlotsMutation();

  // chaging unit
  useEffect(() => {
    setAlgorithm(pieceData.name);
    setMainStat(pieceData.stat);
    updateSlots(
      { name: parseAlgoName(pieceData.name), currentSlots: pieceData.slot },
      { onSuccess: (data) => setSlot(data) }
    );
  }, [pieceData]);

  // changing details, passed to parent's setDollData
  useEffect(() => {
    // pieceUpdate(piece, category, index);
    // NOTE: do NOT put pieceUpdate in the depency Array
    // TODO: test
  }, [category, piece]);

  function pieceHandler(name: Algorithm) {
    console.warn(name);
    let nextPiece = { ...pieceData, name };
    setPiece(nextPiece);
    updatePiece(nextPiece, loadoutId);

    setModal(false);
  }

  function mainStatHandler(event: ChangeEvent<HTMLSelectElement> | string) {
    let stat: AlgoMainStat = "Atk";
    if (typeof event === "string") stat = event as AlgoMainStat;
    else stat = event.currentTarget.value as AlgoMainStat;

    let nextPiece = { ...pieceData, stat };
    setPiece(nextPiece);
    setMainStat(stat);

    updatePiece(nextPiece, loadoutId);
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
            />
          ) : null}
          <Button className="small red" onClick={() => {}}>
            <TrashIcon />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
export default AlgorithmPiece;
