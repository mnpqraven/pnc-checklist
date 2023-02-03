import Image from "next/image";
import { ResourceByDay } from "@/src-tauri/bindings/structs";
import { Bonus } from "@/src-tauri/bindings/enums";
import { useTimetable } from "@/utils/hooks/useTimetable";

const Timetable = () => {
  const timetable: ResourceByDay[] = useTimetable();

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
              <td key={index}>
                <DailyBonus day={day} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
};

const DailyBonus = ({ day }: { day: ResourceByDay }) => {
  let x2: string[] = [];
  let grid: (Bonus | string)[] = []; // 4 items
  if (day.class && typeof day.class == "object") grid.push(day.class.Class);
  if (day.coin != null) x2.push(day.coin.toString());
  if (day.exp != null) x2.push(day.exp.toString());
  if (day.skill != null) x2.push(day.skill.toString());
  grid.push(...x2);

  return (
    <div className="flex flex-col">
      {grid.flat().map((item, index) => (
        <div key={index}>
          {item ? (
            <Image
              src={`/class/${item.toString().toLowerCase()}.png`}
              alt={item.toString()}
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
};
export default Timetable;
