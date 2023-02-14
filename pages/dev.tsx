import MainstatSelect from "@/components/MainstatSelect";
import { AlgoCategory } from "@/src-tauri/bindings/enums";

const Dev = () => {
  const payload: AlgoCategory = "Stability";
  const options = [
    "Health",
    "HealthPercent",
    "PostBattleRegen",
    "Def",
    "DefPercent",
    "OperandDef",
    "OperandDefPercent",
  ];
  return (
    <main>
      <div className="flex">
        <div className="grow">this is a div</div>
        <div>
          <MainstatSelect
            value="Overflow"
            labelPayload={{ method: "print_main_stat", payload }}
            options={options}
            onChangeHandler={() => {}}
            category={"Stability"}
          />
        </div>
      </div>
    </main>
  );
};
export default Dev;
