/* eslint-disable react-hooks/exhaustive-deps */
import { AlgoCategory, AlgoTypeDb, DAY } from "@/interfaces/datamodel";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import Image from "next/image";
import { algo_src, parse_date_iso } from "@/utils/helper";

type Props = {
  day: string;
};
const TodayAlgo = ({ day }: Props) => {
  const [algos, setAlgos] = useState<AlgoTypeDb[]>([]); // [category: [algo]]
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
      }
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
      <div className="flex">
        {algos.length > 0 ? (
          algos.map((category, index_cat) => (
            <div key={index_cat} className="px-2 text-center">
              {/* TODO: table */}
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
    </>
  );
};
export default TodayAlgo;
