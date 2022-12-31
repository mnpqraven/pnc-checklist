import {
  Algorithm,
  AlgoCategory,
  AlgoPiece,
  AlgoMainStat,
  LOADOUTTYPE,
  ALGOMAINSTAT,
  ALGORITHM,
} from "@/interfaces/datamodel";
import { get_algo } from "@/utils/helper";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Loading, Select } from "@/components/Common";
import { OptionPayload } from "./AlgorithmSet";
import SlotCheckbox from "./SlotCheckbox";
import { DollContext } from "@/interfaces/payloads";

type Props = {
  index: number;
  pieceData: AlgoPiece;
  options: OptionPayload;
  category: AlgoCategory;
  valid: boolean | undefined;
};
const AlgorithmPiece = ({
  index,
  pieceData,
  options,
  category,
  valid,
}: Props) => {
  const { dollData, setDollData, updateDirtyList } = useContext(DollContext);
  const [nameLabel, setNameLabel] = useState(pieceData.name);
  const [mainStatLabel, setMainStatLabel] = useState(pieceData.stat);
  const [slot, setSlot] = useState<boolean[]>([false, false]);

  useEffect(() => {
    setNameLabel(pieceData.name);
    setMainStatLabel(pieceData.stat);
    setSlot(pieceData.slot);
  }, [pieceData]);

  function pieceHandler(event: ChangeEvent<HTMLSelectElement>) {
    if (dollData && setDollData && updateDirtyList) {
      let clone = { ...dollData };
      get_algo(category, dollData, "current")[index].name = event.currentTarget
        .value as Algorithm;
      setNameLabel(event.currentTarget.value as Algorithm);
      updateDirtyList(clone);
    }
  }
  function mainStatHandler(event: ChangeEvent<HTMLSelectElement>) {
    if (dollData && setDollData && updateDirtyList) {
      let clone = { ...dollData };
      get_algo(category, dollData, LOADOUTTYPE.current)[index].stat = event
        .currentTarget.value as AlgoMainStat;
      setMainStatLabel(event.currentTarget.value as AlgoMainStat);
      updateDirtyList(clone);
    }
  }
  function slotHandler(
    e: ChangeEvent<HTMLInputElement>,
    checkboxIndex: number
  ) {
    if (dollData && setDollData && updateDirtyList) {
      let cloneProfile = { ...dollData };
      let cloneSlot = get_algo(category, cloneProfile, LOADOUTTYPE.current)[
        index
      ].slot;
      cloneSlot[checkboxIndex] = e.target.checked;
      setSlot(cloneSlot);
      updateDirtyList(cloneProfile);
    }
  }
  function deleteHandler() {
    // TODO: current vs goal differentiate
    if (dollData && setDollData && updateDirtyList) {
      let cloneProfile = { ...dollData };
      // intentionally uses splice here cause cloneProfile is already a copy
      get_algo(category, cloneProfile, LOADOUTTYPE.current).splice(index, 1);
      updateDirtyList(cloneProfile);
    }
  }

  return (
    <>
      <div
        className={`${
          valid === false ? `border border-red-500` : ``
        } flex justify-between`}
      >
        <Select
          value={nameLabel}
          options={Object.values(options.algoTypes.algos)}
          label={Object.values(options.algoTypes.algos).map(
            (e) => ALGORITHM[e as Algorithm]
          )}
          onChangeHandler={pieceHandler}
        />
        <div className="m-2">
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
          <button onClick={deleteHandler}>delete</button>
        </div>
      </div>
    </>
  );
};
export default AlgorithmPiece;
