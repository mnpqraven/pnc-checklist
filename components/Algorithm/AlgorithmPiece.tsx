import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Loading } from "@/components/Common";
import { OptionPayload } from "./AlgorithmSet";
import SlotCheckbox from "./SlotCheckbox";
import { DollContext } from "@/interfaces/payloads";
import { invoke } from "@tauri-apps/api/tauri";
import { AlgoPiece, AlgoSlot } from "@/src-tauri/bindings/structs";
import {
  AlgoCategory,
  AlgoMainStat,
  Algorithm,
  SlotPlacement,
} from "@/src-tauri/bindings/enums";
import PieceModal from "./PieceModal";
import { AnimatePresence, motion } from "framer-motion";
import MainStatSelect from "../RadixDropdown";
import { TrashIcon } from "@radix-ui/react-icons";
import AlgoImage from "./AlgoImage";
import { useComputeSlotsMutation } from "@/utils/hooks/mutations/computeSlots";
import { useImmer } from "use-immer";
import { Slot } from "@/src-tauri/bindings/structs/Slot";
import { useEnumTable } from "@/utils/hooks/useEnumTable";
import { ENUM_TABLE } from "@/src-tauri/bindings/ENUM_TABLE";

type Props = {
  index: number;
  pieceData: AlgoPiece;
  options: OptionPayload;
  category: AlgoCategory;
  valid: boolean | undefined;
  onChange: (e: AlgoPiece | null, cat: AlgoCategory, index: number) => void;
};

const AlgorithmPiece = ({
  index,
  pieceData,
  options,
  category,
  valid,
  onChange: pieceUpdate,
}: Props) => {
  const { dollData } = useContext(DollContext);
  const [algorithm, setAlgorithm] = useState(pieceData.name);
  const [mainStat, setMainStat] = useState(pieceData.stat);
  const [slot, setSlot] = useImmer<AlgoSlot>([]);
  const [piece, setPiece] = useState<AlgoPiece | null>(pieceData);
  const [openModal, setModal] = useState(false);

  const { mutate: updateSlots } = useComputeSlotsMutation();

  const { data: slotPlacementIter } = useEnumTable<SlotPlacement>(
    ENUM_TABLE.SlotPlacement
  );

  // chaging unit
  useEffect(() => {
    setAlgorithm(pieceData.name);
    setMainStat(pieceData.stat);
    updateSlots(
      { name: pieceData.name, currentSlots: pieceData.slot },
      { onSuccess: (data) => setSlot(data) }
    );
  }, [pieceData]);

  // changing details, passed to parent's setDollData
  useEffect(() => {
    pieceUpdate(piece, category, index);
    // NOTE: do NOT put pieceUpdate in the depency Array
    // TODO: test
  }, [category, index, piece]);

  function pieceHandler(name: Algorithm) {
    invoke<AlgoSlot | null>("validate_slots", { piece: pieceData })
      .then((slot) => {
        if (slot) {
          setSlot(slot);
          setPiece({ ...pieceData, name, slot });
        } else setPiece({ ...pieceData, name });
      })
      .finally(() => {
        setModal(false);
        setAlgorithm(name);
      });
  }

  function mainStatHandler(event: ChangeEvent<HTMLSelectElement> | string) {
    let stat: AlgoMainStat = "Atk";
    if (typeof event === "string") stat = event as AlgoMainStat;
    else stat = event.currentTarget.value as AlgoMainStat;

    setPiece({ ...pieceData, stat });
    setMainStat(stat);
  }

  /**
   * Updates the slots in an `AlgoPiece`
   * @param e new value of the slot managed by thecheckbox
   * @param checkboxIndex the index of the slot in the `AlgoPiece`
   */
  function slotHandler(e: boolean | "indeterminate", checkboxIndex: number) {
    if (e === "indeterminate") return;
    if (slotPlacementIter) {
      let next_slot: Slot[] = slot.map((item, index) => {
        if (index === checkboxIndex) {
          return { placement: slotPlacementIter[index], value: e };
        } else return item;
      });
      setPiece({ ...pieceData, slot: next_slot });
      setSlot(next_slot);
    }
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
            handleClose={() => setModal(false)}
            category={category}
            onSelect={pieceHandler}
          />
        )}
      </AnimatePresence>
      <div className="mx-2 cursor-pointer">
        <AlgoImage algo={algorithm} onClick={() => setModal(!openModal)} />
      </div>
      <div className="flex max-w-[10rem] grow flex-col gap-2">
        <MainStatSelect
          value={mainStat}
          labelPayload={{ method: "print_main_stat", payload: category }}
          options={options.mainStat}
          onChangeHandler={mainStatHandler}
          category={category}
        />
        <div className="flex flex-row items-center justify-between">
          {dollData ? (
            <SlotCheckbox
              value={slot}
              unitClass={dollData.class}
              category={category}
              onChangeHandler={slotHandler}
            />
          ) : (
            <Loading />
          )}
          <button
            className="Button small red"
            onClick={() => pieceUpdate(null, category, index)}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default AlgorithmPiece;
