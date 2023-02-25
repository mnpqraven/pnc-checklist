'use client';
import Button from "@/components/Button";
import MainstatSelect from "@/components/MainstatSelect";
import { AlgoCategory } from "@/src-tauri/bindings/enums";
import { invoke } from "@tauri-apps/api/tauri";
import { useContext, useEffect, useState } from "react";
import { createClient } from "@rspc/client";
import { TauriTransport } from "@rspc/tauri";
import { Procedures } from "@/src-tauri/bindings/rspc";
import { rspc, rspcClient } from "@/components/Toast/Providers";
import dynamic from "next/dynamic";
import { useQueryClient } from "@tanstack/react-query";
import { createReactQueryHooks } from "@rspc/react";

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

  rspc.useQuery(['version'])

  async function newUser() {}
  async function getUser() {}

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
      <ul></ul>
    </main>
  );
};
export default Dev;
