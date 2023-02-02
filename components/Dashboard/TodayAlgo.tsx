import Image from "next/image";
import { algo_src } from "@/utils/helper";
import Loading from "../Loading";
import { useAlgoByDayQuery } from "@/utils/queryHooks";

type Props = {
  day: string;
  onMouseEnter: (offset: number) => void;
  onMouseLeave: () => void;
};
const TodayAlgo = ({ day, onMouseEnter, onMouseLeave }: Props) => {
  const { isLoading, isError, data: algoByDay } = useAlgoByDayQuery(day);

  const isGrowNeeded = algoByDay.map((tuple) => tuple[1].length == 0);

  if (isLoading) return <Loading />;
  if (isError) return <p>Error encountered</p>;

  return (
    <>
      <div>
        <div className="flex w-60 justify-around">
          <div
            onMouseEnter={() => onMouseEnter(-1)}
            onMouseLeave={onMouseLeave}
          >
            Prev
          </div>
          <div>{day}</div>
          <div onMouseEnter={() => onMouseEnter(1)} onMouseLeave={onMouseLeave}>
            Next
          </div>
        </div>

        <div className="flex">
          {algoByDay.length > 0 ? (
            algoByDay.map(([category, algos], index_cat) => (
              <div
                key={index_cat}
                className={`flex flex-col px-2 text-center ${
                  isGrowNeeded[index_cat] ? `grow` : ""
                }`}
              >
                <p>{category[0]}</p>
                {category.length > 0 &&
                  algos.map((algo, index_alg) => (
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
            <p>Weekend, no algo farm</p>
          )}
        </div>
      </div>
    </>
  );
};
export default TodayAlgo;
