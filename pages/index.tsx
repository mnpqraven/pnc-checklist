import { Timetable, TodayAlgo, ResetCalendar } from "@/components/Dashboard";
import Summary from "@/components/Resources/Summary";
import { useDay } from "@/utils/hooks/useDay";

// JS day array shifted left by 1 because we're getting the day before reset
const Index = () => {
  const {day, updateDay} = useDay()

  return (
    <main>
      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className="flex flex-col">
            <div className="card component_space w-fit">
              <Timetable />
            </div>
            <div className="card component_space w-fit">
              <ResetCalendar />
            </div>
          </div>
          <div className="card component_space">
            <TodayAlgo dayIndex={day} onMouseEnter={updateDay} />
          </div>
        </div>
        <div className="card component_space w-min">
          <Summary />
        </div>
      </div>
    </main>
  );
};
export default Index;
