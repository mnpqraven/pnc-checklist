import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Loading, Select } from "@/components/Common";
import { OptionPayload } from "./AlgorithmSet";
import SlotCheckbox from "./SlotCheckbox";
import { DollContext } from "@/interfaces/payloads";
import Image from "next/image";
import { invoke } from "@tauri-apps/api/tauri";
import { AlgoPiece } from "@/src-tauri/bindings/structs/AlgoPiece";
import { Algorithm } from "@/src-tauri/bindings/enums/Algorithm";
import { AlgoCategory } from "@/src-tauri/bindings/enums/AlgoCategory";
import { AlgoMainStat } from "@/src-tauri/bindings/enums/AlgoMainStat";

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
  const [nameLabel, setNameLabel] = useState(pieceData.name);
  const [mainStatLabel, setMainStatLabel] = useState(pieceData.stat);
  const [slot, setSlot] = useState<boolean[]>([false, false, false]);
  const [piece, setPiece] = useState<AlgoPiece | null>(pieceData);
  const [ALGOMAINSTAT, setALGOMAINSTAT] = useState<string[]>([])
  const [ALGORITHM, setALGORITHM] = useState<string[]>([])

  useEffect(() => {
    invoke<string[]>('enum_ls', {name: "AlgoMainStat"}).then(setALGOMAINSTAT)
    invoke<string[]>('enum_ls', {name: "Algorithm"}).then(setALGORITHM)
  }, [])
  // chaging unit
  useEffect(() => {
    setNameLabel(pieceData.name);
    setMainStatLabel(pieceData.stat);

    // update slot info
    // setSlot(pieceData.slot);
    updateSlots(pieceData.name, pieceData.slot).then((e) => {
      setSlot(e);
    });
  }, [pieceData]);
  // changing details, passed to parent's setDollData
  useEffect(() => {
    pieceUpdate(piece, category, index);
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

  function pieceHandler(event: ChangeEvent<HTMLSelectElement>) {
    setPiece({ ...pieceData, name: event.currentTarget.value as Algorithm });
    setNameLabel(event.currentTarget.value as Algorithm);
  }
  function mainStatHandler(event: ChangeEvent<HTMLSelectElement>) {
    setPiece({ ...pieceData, stat: event.currentTarget.value as AlgoMainStat });
    setMainStatLabel(event.currentTarget.value as AlgoMainStat);
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

  // TODO: consider integrate missing prop label with display trait
  return (
    <>
      <div
        className={`${
          valid === false ? `border border-red-500` : ``
        } flex justify-between`}
      >
        <div>
          <Image
            src={`algos/${nameLabel.toLowerCase()}.png`}
            alt={"algo"}
            width={64}
            height={64}
          />
        </div>
        <div className="m-2 flex flex-col">
          <Select
            value={nameLabel}
            options={Object.values(options.algoTypes.algos)}
            onChangeHandler={pieceHandler}
          />
          <Select
            value={mainStatLabel}
            options={options.mainStat}
            onChangeHandler={mainStatHandler}
          />
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
        </div>
        <div className="self-center">
          <button onClick={() => setPiece(null)}>delete</button>
        </div>
      </div>
    </>
  );
};
export default AlgorithmPiece;
