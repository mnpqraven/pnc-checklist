import { Class, CLASS, DAY, Day, ResourceByDay } from "@/interfaces/datamodel";
import { invoke } from "@tauri-apps/api/tauri";
import { getPriority } from "os";
import { useEffect, useState } from "react";

const Timetable = () => {
  const [timetable, setTimetable] = useState<ResourceByDay[]>([]);

  async function get_timetable() {
    let list: ResourceByDay[] = [];
    for (const day in DAY) {
      list.push(await invoke<ResourceByDay>("get_bonuses", { day }));
    }
    setTimetable(list);
  }
  function get_current_bonus(day: ResourceByDay) {
    let cl = "";
    let x2 = [""];
    let grid = []; // 4 items
    if (day.class) cl = Object.values(day.class).toString();
    if (day.coin != null) x2.push(day.coin);
    if (day.exp != null) x2.push(day.exp);
    if (day.skill != null) x2.push(day.skill);
    grid.push(x2);
    grid.push(cl);

    return (
      <div className="flex flex-col">
        {grid.flat().map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    );
  }

  useEffect(() => {
    // mount
    get_timetable();
  }, []);
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
