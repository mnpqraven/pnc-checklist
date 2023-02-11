import Image from "next/image";
import { algo_src } from "@/utils/helper";
import Loading from "../Loading";
import { DEFAULT_DAYS } from "@/utils/defaults";
import { useEffect, useState } from "react";
import { useAlgoByDayQuery } from "@/utils/hooks/algo/useAlgoByDayQuery";
import ErrorContainer from "../Error";

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
    mouseInteract(undefined);
  }, []);

  return (
    <>
      <div>
        <div className="grid w-60 grid-cols-3 px-2">
          {["Prev", undefined, "Next"].map((item, index) =>
            item ? (
              <button
                key={index}
                className="Button small violet"
                onMouseEnter={() => mouseInteract(index - 1)}
                onClick={() => mouseInteract(index - 1)}
                onMouseLeave={() => mouseInteract(undefined)}
              >
                {item}
              </button>
            ) : (
              <p key={index} className="text-center">
                {DEFAULT_DAYS[dayIndex]}
              </p>
            )
          )}

          {isWeekday ? (
            algoByDay.map(([category, algos], index_cat) => (
              <div key={index_cat} className="flex flex-col px-2 text-center">
                <p>{category}</p>
                {algos.map((algo, index_alg) => (
                  <div
                    key={index_alg}
                    className="flex h-[64px] w-[64px] items-center"
                  >
                    <Image
                      priority
                      src={algo_src(algo)}
                      alt={algo}
                      height={128}
                      width={128}
                    />
                  </div>
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
      </div>
    </>
  );
};
export default TodayAlgo;
