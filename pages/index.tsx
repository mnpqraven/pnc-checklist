import { Timetable, TodayAlgo, ResetCalendar } from "@/components/Dashboard";
import { date_passed, parse_date_iso } from "@/utils/helper";
import { useCallback, useEffect, useState } from "react";
import styles from "@/styles/Page.module.css";
import Summary from "@/components/Resources/Summary";
import { MILLIS_PER_DAY } from "@/components/Dashboard/hooks/useClock";

// JS day array shifted left by 1 because we're getting the day before reset
const Index = () => {
  const [ind, setInd] = useState(0);

  const updateDay = useCallback((offset: number) => {
    let now = new Date();
    let next: Date = new Date(parse_date_iso(now));
    if (date_passed(now)) {
      next = new Date(parse_date_iso(new Date(+now + MILLIS_PER_DAY)));
    }
    let ree = (next.getUTCDay() + 7 + offset) % 7;
    setInd(ree);
  }, []);

  useEffect(() => {
    updateDay(0);
  }, []);

  function handleMouseEnter(offset: number) {
    updateDay(offset);
  }

  return (
    <main>
      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className="flex flex-col">
            <div className={`${styles.card} ${styles.component_space} w-fit`}>
              <Timetable />
            </div>
            <div className={`${styles.card} ${styles.component_space} w-fit`}>
              <ResetCalendar />
            </div>
          </div>
          <div className={`${styles.card} ${styles.component_space}`}>
            <TodayAlgo
              dayIndex={ind}
              onMouseEnter={handleMouseEnter}
            />
          </div>
        </div>
        <div className={`${styles.card} ${styles.component_space} w-min`}>
          <Summary />
        </div>
      </div>
    </main>
  );
};
export default Index;
