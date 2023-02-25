import { parse_date_iso } from "@/utils/helper";
import { useState } from "react";

type Clock = { hours: string; minutes: string; seconds: string };
export const MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
const MILLIS_PER_HOUR = 1000 * 60 * 60;
const MILLIS_PER_MIN = 1000 * 60;
const MILLIS_PER_SEC = 1000;

export const useClock = () => {
  const [nextReset, setNextReset] = useState(
    new Date(parse_date_iso(new Date()))
  );
  const [timer, setTimer] = useState<Clock>({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const updateDailyReset = () => {
    setTimer(till_reset());
  };

  function till_reset(): Clock {
    if (+nextReset - +new Date() < 0) {
      // passed
      let nextDate = new Date(+nextReset + MILLIS_PER_DAY);
      let diff = +new Date(+nextReset + MILLIS_PER_DAY) - +new Date();
      setNextReset(nextDate);
      return get_countdown(diff);
    } else {
      let diff = +nextReset - +new Date();
      return get_countdown(diff);
    }
  }

  return { timer, updateDailyReset };
};

function get_countdown(unixTime: number): Clock {
  let hours = Math.floor(unixTime / MILLIS_PER_HOUR);
  let minutes = Math.floor((unixTime - hours * MILLIS_PER_HOUR) / MILLIS_PER_MIN);
  let seconds = Math.floor(
    (unixTime - hours * MILLIS_PER_HOUR - minutes * MILLIS_PER_MIN) /
      MILLIS_PER_SEC
  );
  let cock: Clock = {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
  return cock;
}
