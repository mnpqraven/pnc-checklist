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
  const { isLoading, isError, data: algoByDay } = useAlgoByDayQuery(dayIndex);

  const isGrowNeeded = algoByDay.map((tuple) => tuple[1].length == 0);
  const isWeekday = !isGrowNeeded.every((cat) => cat);

  function mouseInteract(changes: number = -offset) {
    onMouseEnter(offset + changes);
    setOffset(offset + changes);
  }

  useEffect(() => {
      mouseInteract(undefined)
  }, []);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorContainer />

  return (
    <>
      <div>
        <div className="flex w-60 justify-between px-2">
          <button
            onMouseEnter={() => mouseInteract(-1)}
            onClick={() => mouseInteract(-1)}
            onMouseLeave={() => mouseInteract(undefined)}
          >
            Prev
          </button>
          <div>{DEFAULT_DAYS[dayIndex]}</div>
          <button
            onMouseEnter={() => mouseInteract(1)}
            onClick={() => mouseInteract(1)}
            onMouseLeave={() => mouseInteract(undefined)}
          >
            Next
          </button>
        </div>

        <div className="flex justify-center">
          {isWeekday ? (
            algoByDay.map(([category, algos], index_cat) => (
              <div
                key={index_cat}
                className={`flex flex-col px-2 text-center ${
                  isGrowNeeded[index_cat] ? `grow` : ""
                }`}
              >
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
            <p>Weekend</p>
          )}
        </div>
      </div>
    </>
  );
};
export default TodayAlgo;
