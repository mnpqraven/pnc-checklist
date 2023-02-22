import Button from "@/components/Button";
import MainstatSelect from "@/components/MainstatSelect";
import { AlgoCategory } from "@/src-tauri/bindings/enums";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

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
  type Ret = {
    id: string;
    displayName: string;
  };
  const [results, setResult] = useState<Ret[]>([]);

  async function newUser() {
    await invoke("new_user");
  }
  async function getUser() {
    invoke<Ret[]>("get_user").then(setResult);
  }

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
      <Button onClick={newUser}>new</Button>
      <Button onClick={getUser}>get</Button>
      <ul>

      {results.map(({id, displayName}) => (
        <li key={id}>{displayName}</li>
      ))}
      </ul>
    </main>
  );
};
export default Dev;
