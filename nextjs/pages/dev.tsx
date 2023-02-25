import Button from "@/components/Button";
import MainstatSelect from "@/components/MainstatSelect";
import { AlgoCategory } from "@/src-tauri/bindings/enums";
import { rspcClient } from "@/utils/rspc";
import { useQuery } from "@tanstack/react-query";

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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["units"],
    queryFn: () => rspcClient.query(["units"]),
  });

  if (isLoading || isError) return null;

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
      <p>unit list</p>
      <ul>
        {data.map((item, index) => (
          <li key={index}> {item.name}</li>
        ))}
      </ul>
    </main>
  );
};
export default Dev;
