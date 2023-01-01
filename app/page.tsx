"use client";
import { Timetable, TodayAlgo, ResetCalendar } from "@/components/Dashboard";
import { parse_date_iso } from "@/utils/helper";
import { useState } from "react";
import styles from "./page.module.css";

// JS day array shifted left by 1 because we're getting the day before reset
const list = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const Index = () => {
  const [nextDate, setNextDate] = useState(
    new Date(parse_date_iso(new Date()))
  );
  const day = list[nextDate.getUTCDay()];

  function handlePrevDate(e: Date) {
    setNextDate(e);
  }
  return (
    <>
      <div className={`${styles.card} ${styles.component_space} w-fit`}>
        <Timetable />
      </div>
      <div className={`${styles.card} ${styles.component_space} w-fit`}>
        <TodayAlgo day={day} />
      </div>
      <div className={`${styles.card} ${styles.component_space} w-fit`}>
        <ResetCalendar prevDateHandler={handlePrevDate} />
      </div>
    </>
  );
};
export default Index;
