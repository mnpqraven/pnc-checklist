import { invoke } from "@tauri-apps/api/tauri";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ResourceByDay } from "@/src-tauri/bindings/structs";

const Timetable = () => {
  const [timetable, setTimetable] = useState<ResourceByDay[]>([]);
  const [DAY, setDAY] = useState<string[]>([]);


  useEffect(() => {
    invoke<string[]>("enum_ls", { name: "Day" }).then(setDAY);
  }, []);

  const get_timetable = useCallback(async () => {
    let list: ResourceByDay[] = [];
    for (const day of DAY) {
      await invoke<ResourceByDay>("get_bonuses", { day }).then(e => list.push(e));
    }
    setTimetable(list);
  }, [DAY]);

  useEffect(() => {
    get_timetable();
  }, [get_timetable]);

  function get_current_bonus(day: ResourceByDay) {
    let cl = "";
    let x2 = [""];
    let grid = []; // 4 items
    if (day.class) cl = Object.values(day.class).toString();
    if (day.coin != null) x2.push(day.coin.toString());
    if (day.exp != null) x2.push(day.exp.toString());
    if (day.skill != null) x2.push(day.skill.toString());
    grid.push(x2);
    grid.push(cl);

    return (
      <div className="flex flex-col">
        {grid.flat().map((item, index) => (
          <div key={index}>
            {item ? (
              <Image
                src={`/class/${item.toLowerCase()}.png`}
                alt={item}
                width={24}
                height={24}
              />
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            {timetable.map((day, index) => (
              <th key={index}>{day.day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {timetable.map((day, index) => (
              <td key={index}>{get_current_bonus(day)}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
};
export default Timetable;
