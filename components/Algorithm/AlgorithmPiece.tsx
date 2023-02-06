import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Loading, Select } from "@/components/Common";
import { OptionPayload } from "./AlgorithmSet";
import SlotCheckbox from "./SlotCheckbox";
import { DollContext } from "@/interfaces/payloads";
import Image from "next/image";
import { invoke } from "@tauri-apps/api/tauri";
import { AlgoPiece, AlgoSlot } from "@/src-tauri/bindings/structs";
import {
  AlgoCategory,
  AlgoMainStat,
  Algorithm,
} from "@/src-tauri/bindings/enums";
import { algo_src } from "@/utils/helper";
import PieceModal from "./PieceModal";
import { AnimatePresence } from "framer-motion";

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
  const [slot, setSlot] = useState<boolean[]>([false, false, false]);
  const [piece, setPiece] = useState<AlgoPiece | null>(pieceData);
  const [openModal, setModal] = useState(false);
  const { storeLoading } = useContext(DollContext);

  // chaging unit
  useEffect(() => {
    setAlgorithm(pieceData.name);
    setMainStat(pieceData.stat);

    // update slot info
    // setSlot(pieceData.slot);
    updateSlots(pieceData.name, pieceData.slot).then((e) => {
      setSlot(e);
    });
  }, [pieceData]);

  // changing details, passed to parent's setDollData
  useEffect(() => {
    pieceUpdate(piece, category, index);
    // NOTE: do NOT put pieceUpdate in the depency Array
    // TODO: test
  }, [category, index, piece, pieceUpdate]);

  async function updateSlots(
    name: Algorithm,
    currentSlots: boolean[]
  ): Promise<boolean[]> {
    let invoked_slots = invoke<boolean[]>("algo_slots_compute", {
      name,
      currentSlots,
    });
    return invoked_slots;
  }

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

  function mainStatHandler(event: ChangeEvent<HTMLSelectElement>) {
    setPiece({ ...pieceData, stat: event.currentTarget.value as AlgoMainStat });
    setMainStat(event.currentTarget.value as AlgoMainStat);
  }

  function slotHandler(
    e: ChangeEvent<HTMLInputElement>,
    checkboxIndex: number
  ) {
    let slot = pieceData.slot.map((item, index) => {
      if (checkboxIndex == index) return e.target.checked;
      else return item;
    });
    if (pieceData.slot.length <= checkboxIndex) slot.push(e.target.checked);
    setPiece({ ...pieceData, slot });
    setSlot(slot);
  }

  function close() {
    console.warn("modal closed");
    setModal(false);
  }
  function open() {
    console.warn("modal closed");
    setModal(true);
  }

  return (
    <>
      <div
        id="algo-piece"
        className={`flex items-center justify-center
        ${valid === false ? `border border-red-500` : ``} `}
      >
        <AnimatePresence initial={false} mode="wait">
          {openModal && (
            <PieceModal
              handleClose={close}
              category={category}
              onSelect={pieceHandler}
            />
          )}
        </AnimatePresence>
        <div className="mx-2 cursor-pointer self-center">
          <Image
            src={algo_src(algorithm)}
            alt={"algo"}
            className="aspect-square max-h-16"
            width={64}
            height={64}
            onClick={() => setModal(!openModal)}
            priority
          />
        </div>
        <div className="flex flex-col">
          <Select
            value={mainStat}
            labelPayload={{ method: "print_main_stat", payload: category }}
            options={options.mainStat}
            onChangeHandler={mainStatHandler}
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
            <button onClick={() => pieceUpdate(null, category, index)}>
              Del
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlgorithmPiece;
