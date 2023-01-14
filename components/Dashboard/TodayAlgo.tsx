/* eslint-disable react-hooks/exhaustive-deps */
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import Image from "next/image";
import { algo_src } from "@/utils/helper";
import { AlgoTypeDb } from "@/src-tauri/bindings/structs";

type Props = {
  day: string;
  onMouseEnter: (offset: number) => void;
  onMouseLeave: () => void;
};
const TodayAlgo = ({ day, onMouseEnter, onMouseLeave }: Props) => {
  const [algos, setAlgos] = useState<AlgoTypeDb[]>([]); // [category: [algo]]

  const isGrowNeeded: boolean[] = algos.map((cat) => {
    if (cat.algos.length == 0) return true;
    else return false;
  });
  async function initdata() {
    let db = await invoke<AlgoTypeDb[]>("generate_algo_db");
    invoke<string[] | null>("get_algo_by_days", { day }).then((today) => {
      if (today) {
        setAlgos(
          db.map((item) => {
            item.algos = item.algos.filter((e) => today.includes(e));
            return item;
          })
        );
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
        <div className="flex justify-around w-60">
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
                <p>{category.category}</p>
                {category.algos.map((algo, index_alg) => (
                  <div
                    key={index_alg}
                    className="w-[64px] h-[64px] flex items-center"
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
