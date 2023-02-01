import { invoke } from "@tauri-apps/api/tauri";
import Image from "next/image";
import { algo_src } from "@/utils/helper";
import { AlgoCategory } from "@/src-tauri/bindings/enums";
import { Algorithm } from "@/src-tauri/bindings/enums";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading";

type Props = {
  day: string;
  onMouseEnter: (offset: number) => void;
  onMouseLeave: () => void;
};
const TodayAlgo = ({ day, onMouseEnter, onMouseLeave }: Props) => {
  const algoDb = useQuery({
    queryKey: ["algoDb"],
    queryFn: () => invoke<[AlgoCategory, Algorithm[]][]>("generate_algo_db"),
  });

  const algoByDays = useQuery({
    queryKey: ["algo_by_days", algoDb, day], // query again when day changes
    queryFn: () => invoke<Algorithm[] | null>("get_algo_by_days", { day }).then(data => data === null ? [] : data),
    enabled: !!algoDb,
  });

  if (algoDb.isLoading || algoByDays.isLoading) return <Loading />;
  if (algoDb.isError || algoByDays.isError) return <p>Error encountered</p>;

  const filteredDb: [AlgoCategory, Algorithm[]][] = algoDb.data.map((item) => [
    item[0],
    item[1].filter((algo) => algoByDays.data.includes(algo)),
  ]);

  const isGrowNeeded: boolean[] = algoDb.data.map((cat) => {
    if (cat[1].length == 0) return true;
    else return false;
  });

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
          {filteredDb.length > 0 ? (
            filteredDb.map((category, index_cat) => (
              <div
                key={index_cat}
                className={`flex flex-col px-2 text-center ${
                  isGrowNeeded[index_cat] ? `grow` : ""
                }`}
              >
                <p>{category[0]}</p>
                {category[1].length > 0 &&
                  category[1].map((algo, index_alg) => (
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
