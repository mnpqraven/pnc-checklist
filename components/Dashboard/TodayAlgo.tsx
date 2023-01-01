import { AlgoCategory, AlgoTypeDb, DAY } from "@/interfaces/datamodel";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import Image from "next/image";
import { algo_src } from "@/utils/helper";

const TodayAlgo = () => {
  const [algos, setAlgos] = useState<AlgoTypeDb[]>([]); // [category: [algo]]
  async function initdata() {
    let db = await invoke<AlgoTypeDb[]>("generate_algo_db");
    // TODO: day
    let today: string[] = await invoke("get_algo_by_days", { day: DAY.Thu });

    setAlgos(
      db.map((item) => {
        item.algos = item.algos.filter((e) => today.includes(e));
        return item;
      })
    );
  }

  useEffect(() => {
    initdata();
  }, []);

  return (
    <>
      <div className="flex">
        {algos.map((category, index_cat) => (
          <div key={index_cat} className="px-2">
            {/* TODO: table */}
            <p>{category.category}</p>
            {category.algos.map((algo, index_alg) => (
              <div key={index_alg} className="w-[64px] h-[64px] flex items-center">
                <Image
                  src={algo_src(algo)}
                  alt="algo"
                  height={128}
                  width={128}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};
export default TodayAlgo;
