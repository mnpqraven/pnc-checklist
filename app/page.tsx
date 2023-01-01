"use client";
import { Timetable, TodayAlgo } from "@/components/Dashboard";

export default function Index() {
  return (
    <>
      <p>home page</p>
      <div>
        <Timetable />
      </div>
      <TodayAlgo />
    </>
  );
}
