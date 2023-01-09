import { Timetable, TodayAlgo, ResetCalendar } from "@/components/Dashboard";
import { date_passed, parse_date_iso } from "@/utils/helper";
import { useCallback, useEffect, useState } from "react";
import styles from "@/styles/Page.module.css";
import Summary from "@/components/Resources/Summary";
import { MILLIS_PER_DAY } from "@/components/Dashboard/ResetCalendar";

// JS day array shifted left by 1 because we're getting the day before reset
const list = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const Index = () => {
  const [nextDate, setNextDate] = useState(
    new Date(parse_date_iso(new Date()))
  );
  const [day, setDay] = useState(list[0]);

  const updateDay = useCallback((offset: number) => {
    let next: Date = new Date(parse_date_iso(new Date()));
    if (date_passed(new Date())) {
      // TODO: refactor hack
      next = new Date(parse_date_iso(new Date(+new Date() + MILLIS_PER_DAY)));
      setNextDate(next);
    }
    let ree = list[(next.getUTCDay() + 7 + offset) % 7];
    setDay(ree);
  }, []);

  useEffect(() => {
    updateDay(0);
  }, [updateDay]);

  function handleMouseEnter(e: number) {
    updateDay(e);
  }
  function handleMouseLeave() {
    updateDay(0);
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
              <ResetCalendar prevDateHandler={setNextDate} />
            </div>
          </div>
          <div className={`${styles.card} ${styles.component_space}`}>
            <TodayAlgo
              day={day}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
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
