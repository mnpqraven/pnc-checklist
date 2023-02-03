import { useClock } from "@/utils/hooks/useClock";
import { useEffect } from "react";

const ResetCalendar = () => {
  const { timer, updateDailyReset } = useClock();

  useEffect(() => {
    updateDailyReset(); // avoids seeing zeroes after render
    const interval = setInterval(() => {
      updateDailyReset();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <p>Next reset in:</p>
      <p>
        {timer.hours} : {timer.minutes} : {timer.seconds}
      </p>
    </>
  );
};
export default ResetCalendar;
