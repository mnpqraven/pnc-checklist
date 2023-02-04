import { useState } from "react";
import { date_passed, parse_date_iso } from "../helper";
import { MILLIS_PER_DAY } from "./useClock";

export const useDay = () => {
  const [day, setDay] = useState(0);

  const updateDay = (offset: number) => {
    let now = new Date();
    let next: Date = new Date(parse_date_iso(now));
    if (date_passed(now))
      next = new Date(parse_date_iso(new Date(+now + MILLIS_PER_DAY)));
    setDay((next.getUTCDay() + 7 + offset) % 7);
  };

  return { day, updateDay };
};
