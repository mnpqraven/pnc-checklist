import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Loading, Select } from "@/components/Common";
import { OptionPayload } from "./AlgorithmSet";
import SlotCheckbox from "./SlotCheckbox";
import { DollContext } from "@/interfaces/payloads";
import Image from "next/image";
import { invoke } from "@tauri-apps/api/tauri";
import { AlgoPiece, AlgoSlot } from "@/src-tauri/bindings/structs";
import { AlgoCategory, AlgoMainStat, Algorithm } from "@/src-tauri/bindings/enums";

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
  }, [category, index, piece]);

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

  function pieceHandler(event: ChangeEvent<HTMLSelectElement>) {
    let name = event.currentTarget.value as Algorithm
    invoke<AlgoSlot | null>('validate_slots', { piece: pieceData })
      .then(slot => {
        if (slot) {
          setSlot(slot)
          setPiece({ ...pieceData, name, slot })
        } else setPiece({ ...pieceData, name });
      })
      .finally(() => setAlgorithm(name));
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
    if (pieceData.slot.length <= checkboxIndex) slot.push(e.target.checked)
    setPiece({ ...pieceData, slot });
    setSlot(slot);
  }

  return (
    <>
      <div
        className={` flex justify-center
        ${valid === false ? `border border-red-500` : ``} `}
      >
        <div>
          <Image
            src={`algos/${algorithm.toLowerCase()}.png`}
            alt={"algo"}
            width={60}
            height={60}
          />
        </div>
        <div className="m-2 flex flex-col">
          <Select
            value={algorithm}
            labelPayload={{ method: 'print_algo', payload: category }}
            options={Object.values(options.algoTypes.algos)}
            onChangeHandler={pieceHandler}
          />
          <Select
            value={mainStat}
            labelPayload={{ method: 'print_main_stat', payload: category }}
            options={options.mainStat}
            onChangeHandler={mainStatHandler}
          />
          <div className="flex flex-row justify-between">
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
            <button onClick={() => pieceUpdate(null, category, index)}>delete</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlgorithmPiece;
