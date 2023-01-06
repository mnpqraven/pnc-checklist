import { Timetable, TodayAlgo, ResetCalendar } from "@/components/Dashboard";
import { date_passed, parse_date_iso } from "@/utils/helper";
import { useCallback, useEffect, useState } from "react";
import styles from "@/styles/Page.module.css";
import Summary from "@/components/Resources/Summary";
import { MILLIS_PER_DAY } from "@/components/Dashboard/ResetCalendar";
import { invoke } from "@tauri-apps/api/tauri";

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

  // FIX: delete when done
  useEffect(() => {
      invoke('debug_database_requirement')
    },[])
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
      <div className={`${styles.card} ${styles.component_space} w-fit`}>
        <Timetable />
      </div>
      <div className={`${styles.card} ${styles.component_space} w-fit`}>
        <TodayAlgo
          day={day}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      </div>
      <div className={`${styles.card} ${styles.component_space} w-fit`}>
        <ResetCalendar prevDateHandler={setNextDate} />
      </div>
      <div className={`${styles.card} ${styles.component_space} w-fit`}>
        <Summary />
      </div>
    </main>
  );
};
export default Index;
