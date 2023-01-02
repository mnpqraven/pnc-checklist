"use client";
import { parse_date_iso } from "@/utils/helper";
import { useEffect, useState } from "react";

type Clock = { hours: string; minutes: string; seconds: string };
const MILLIS_PER_HOUR = 1000 * 60 * 60;
const MILLIS_PER_MIN = 1000 * 60;
const MILLIS_PER_SEC = 1000;

type Props = {
  prevDateHandler: (e: Date) => void;
};
const ResetCalendar = ({ prevDateHandler }: Props) => {
  const [nextReset, setNextReset] = useState(
    new Date(parse_date_iso(new Date()))
  );
  const [timer, setTimer] = useState<Clock>(till_reset());

  function get_countdown(millis: number): Clock {
    let hours = Math.floor(millis / MILLIS_PER_HOUR);
    let minutes = Math.floor(
      (millis - hours * MILLIS_PER_HOUR) / MILLIS_PER_MIN
    );
    let seconds = Math.floor(
      (millis - hours * MILLIS_PER_HOUR - minutes * MILLIS_PER_MIN) /
        MILLIS_PER_SEC
    );
    let cock: Clock = {
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"), // weird bug with server/client
    };
    return cock;
  }
  function till_reset(): Clock {
    if (+nextReset - +new Date() < 0) {
      // passed
      let nextDate = new Date(+nextReset + MILLIS_PER_HOUR * 24);
      let diff = +new Date(+nextReset + MILLIS_PER_HOUR * 24) - +new Date();
      setNextReset(nextDate);
      return get_countdown(diff);
    } else {
      let diff = +nextReset - +new Date();
      return get_countdown(diff);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(till_reset());
      prevDateHandler(nextReset);
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* <p>{time.getHours()}:{time.getMinutes()}:{time.getSeconds()}</p> */}
      <p>Next reset in:</p>
      <p>
        {timer.hours} : {timer.minutes} : {timer.seconds}
      </p>
    </>
  );
};
export default ResetCalendar;