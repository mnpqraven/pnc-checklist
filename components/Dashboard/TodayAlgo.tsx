import { DEFAULT_DAYS } from "@/utils/defaults";
import { useEffect, useState } from "react";
import { useAlgoByDayQuery } from "@/utils/hooks/algo/useAlgoByDayQuery";
import Button from "../Button";
import AlgoImage from "../Algorithm/AlgoImage";

type Props = {
  onMouseEnter: (offset: number) => void;
  dayIndex: number;
};

const TodayAlgo = ({ onMouseEnter, dayIndex }: Props) => {
  const [offset, setOffset] = useState(0);
  const { data: algoByDay } = useAlgoByDayQuery(dayIndex);

  const isEmpty = algoByDay.map((tuple) => tuple[1].length == 0);
  const isWeekday = !isEmpty.every((cat) => cat);

  function mouseInteract(changes: number = -offset) {
    onMouseEnter(offset + changes);
    setOffset(offset + changes);
  }

  useEffect(() => {
    onMouseEnter(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid w-60 grid-cols-3 px-2">
      {["Prev", undefined, "Next"].map((item, index) =>
        item ? (
          <Button
            key={index}
            className={"small violet"}
            onMouseEnter={() => mouseInteract(index - 1)}
            onClick={() => mouseInteract(index - 1)}
            onMouseLeave={() => mouseInteract(undefined)}
            label={item}
          />
        ) : (
          <p key={index} className="text-center">
            {DEFAULT_DAYS[dayIndex]}
          </p>
        )
      )}

      {isWeekday ? (
        algoByDay.map(([category, algos], index_cat) => (
          <div key={index_cat} className="flex flex-col items-center">
            <p>{category}</p>
            {algos.map((algo, index_alg) => (
              <AlgoImage key={index_alg} algo={algo} />
            ))}
          </div>
        ))
      ) : (
        <>
          <div />
          <p className="text-center">Weekend</p>
          <div />
        </>
      )}
    </div>
  );
};
export default TodayAlgo;
