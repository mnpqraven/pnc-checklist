import { Timetable, TodayAlgo, ResetCalendar } from "@/components/Dashboard";
import { parse_date_iso } from "@/utils/helper";
import { useEffect, useState } from "react";
import styles from "@/styles/Page.module.css";
import Summary from "@/components/Resources/Summary";

// JS day array shifted left by 1 because we're getting the day before reset
const list = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const Index = () => {
  const [nextDate, setNextDate] = useState(
    new Date(parse_date_iso(new Date()))
  );
  const today = list[nextDate.getUTCDay()];
  const [day, setDay] = useState(list[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const ree =
        list[(new Date(parse_date_iso(new Date())).getUTCDay() + 1) % 7];
      setDay(ree);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function handleMouseEnter(e: number) {
    switch (e) {
      case 1:
        setDay(list[(nextDate.getUTCDay() + 1) % 7]);
        break;
      case -1:
        setDay(list[(nextDate.getUTCDay() + 6) % 7]);
        break;
    }
  }
  function handleMouseLeave() {
    setDay(today);
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
