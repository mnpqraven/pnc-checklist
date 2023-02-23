import Button from "@/components/Button";
import MainstatSelect from "@/components/MainstatSelect";
import { AlgoCategory } from "@/src-tauri/bindings/enums";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";
import { createClient } from "@rspc/client";
import { TauriTransport } from "@rspc/tauri";
import { Procedures, User } from "@/src-tauri/bindings/rspc";

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

  // client.query(['users']).then((data) =>console.warn(data))

  async function newUser() {
  }
  async function getUser() {
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
      </ul>
    </main>
  );
};
export default Dev;
