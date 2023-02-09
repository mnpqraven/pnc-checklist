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
import MainStatSelect from "../RadixDropdown";
import RadixSlot from "./RadixSlot";

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

  function mainStatHandler(event: ChangeEvent<HTMLSelectElement> | string) {
    let stat: AlgoMainStat = "Atk";
    if (typeof event === "string") stat = event as AlgoMainStat;
    else stat = event.currentTarget.value as AlgoMainStat;

    setPiece({ ...pieceData, stat });
    setMainStat(stat);
  }

  function slotHandler(
    e: ChangeEvent<HTMLInputElement> | boolean | "indeterminate",
    checkboxIndex: number
  ) {
    let val = true;
    if (typeof e === "boolean") val = e;
    else if (e === "indeterminate") val = false;

    let slot = pieceData.slot.map((item, index) => {
      if (checkboxIndex == index) return val;
      else return item;
    });
    if (pieceData.slot.length <= checkboxIndex) slot.push(val);
    setPiece({ ...pieceData, slot });
    setSlot(slot);
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
              handleClose={() => setModal(false)}
              category={category}
              onSelect={pieceHandler}
            />
          )}
        </AnimatePresence>
        <div className="mx-2 cursor-pointer">
          <Image
            src={algo_src(algorithm)}
            alt={algo_src(algorithm)}
            className="max-h-16 w-auto"
            width={256}
            height={256}
            onClick={() => setModal(!openModal)}
            priority
          />
        </div>
        <div className="flex flex-col">
          <MainStatSelect
            value={mainStat}
            labelPayload={{ method: "print_main_stat", payload: category }}
            options={options.mainStat}
            onChangeHandler={mainStatHandler}
            category={category}
          />

          {/*
          <Select
            value={mainStat}
            labelPayload={{ method: "print_main_stat", payload: category }}
            options={options.mainStat}
            onChangeHandler={mainStatHandler}
          />
*/}
          <div className="flex flex-row items-center justify-between">
            {/* <SlotCheckbox */}
            {/*   value={slot} */}
            {/*   unitClass={dollData.class} */}
            {/*   category={category} */}
            {/*   onChangeHandler={slotHandler} */}
            {/* /> */}
            {dollData ? (
              <RadixSlot
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
