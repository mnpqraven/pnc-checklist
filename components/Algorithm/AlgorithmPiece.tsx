import {
  Algorithm,
  AlgoCategory,
  AlgoPiece,
  AlgoMainStat,
  ALGOMAINSTAT,
  ALGORITHM,
} from "@/interfaces/datamodel";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Loading, Select } from "@/components/Common";
import { OptionPayload } from "./AlgorithmSet";
import SlotCheckbox from "./SlotCheckbox";
import { DollContext } from "@/interfaces/payloads";
import Image from "next/image";
import { invoke } from "@tauri-apps/api/tauri";

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

  // changing details, passed to parent's setDollData
  useEffect(() => {
    pieceUpdate(piece, category, index);
  }, [category, index, piece, pieceUpdate]);
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
            label={Object.values(options.algoTypes.algos).map(
              (e) => ALGORITHM[e as Algorithm]
            )}
            onChangeHandler={pieceHandler}
          />
          <Select
            value={mainStatLabel}
            options={options.mainStat}
            label={options.mainStat.map((e) => ALGOMAINSTAT[e])}
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
