/* eslint-disable react-hooks/exhaustive-deps */
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import Image from "next/image";
import { algo_src } from "@/utils/helper";
import { AlgoCategory } from "@/src-tauri/bindings/enums";
import { Algorithm } from "@/src-tauri/bindings/enums";

type Props = {
  day: string;
  onMouseEnter: (offset: number) => void;
  onMouseLeave: () => void;
};
const TodayAlgo = ({ day, onMouseEnter, onMouseLeave }: Props) => {
  const [algos, setAlgos] = useState<[AlgoCategory, Algorithm[]][]>([]);

  const isGrowNeeded: boolean[] = algos.map((cat) => {
    if (cat[1].length == 0) return true;
    else return false;
  });
  async function initdata() {
    let db = await invoke<[AlgoCategory, Algorithm[]][]>("generate_algo_db");
    invoke<Algorithm[]>("get_algo_by_days", { day }).then((option_algos) => {
      if (option_algos) {
        let t = db.map((item) => {
          item[1] = item[1].filter((algo) => option_algos.includes(algo));
          return item;
        });
        setAlgos(t);
      } else setAlgos([]);
    });
  }

  useEffect(() => {
    initdata();
  }, [day]);

  useEffect(() => {
    initdata();
  }, []);

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
          {algos.length > 0 ? (
            algos.map((category, index_cat) => (
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
