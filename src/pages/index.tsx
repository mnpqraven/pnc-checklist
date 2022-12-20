import { ChangeEvent, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Image from "next/image";
import reactLogo from "../assets/react.svg";
import tauriLogo from "../assets/tauri.svg";
import nextLogo from "../assets/next.svg";
// navigation between pages
import Link from "next/link";
import { SkillResourceRequirement, UnitSkill } from "../model/infomodel";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  const [slv, setSlv] = useState(10);
  const [slvAuto, setSlvAuto] = useState(7);
  const [skillRsc, setSkillRsc] = useState<SkillResourceRequirement>({
    token: 0, pivot: 0, coin: 0
  });

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  function handleSlvInput(e: ChangeEvent<HTMLInputElement>) {
    let val: number = parseInt(e.currentTarget.value);
    setSlv(val);
    console.log(val)
  }
  async function calc_slv(slv: number) {
    let t: UnitSkill = {
      passive: slv,
      auto: slvAuto
    };
    let r: SkillResourceRequirement = await invoke("calc_slv", { currentSlv: t })
    setSkillRsc(r);
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <span className="logos">
          <a href="https://nextjs.org" target="_blank">
            <Image
              width={144}
              height={144}
              src={nextLogo}
              className="logo next"
              alt="Next logo"
            />
          </a>
        </span>
        <span className="logos">
          <a href="https://tauri.app" target="_blank">
            <Image
              width={144}
              height={144}
              src={tauriLogo}
              className="logo tauri"
              alt="Tauri logo"
            />
          </a>
        </span>
        <span className="logos">
          <a href="https://reactjs.org" target="_blank">
            <Image
              width={144}
              height={144}
              src={reactLogo}
              className="logo react"
              alt="React logo"
            />
          </a>
        </span>
      </div>

      <p>Click on the Tauri, Next, and React logos to learn more.</p>

      <div className="row">
        <div>
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="button" onClick={() => greet()}>
            Greet
          </button>
        </div>
      </div>
      <div className="row">
        <input
          id="slv-input"
          type="number"
          onChange={(e) => handleSlvInput(e)}
          placeholder="Enter slv number"
        />
        <button type="button"
          onClick={() => calc_slv(slv)}>
          {slv}
        </button>
        <button type="button">
          <Link href={"/doll_list"}>
            Go to details
          </Link>
        </button>
      </div>

      <p>{greetMsg}</p>
      <p>Skill resource needed:</p>
      <p>{skillRsc.token} tokens and {skillRsc.pivot} pivots needed</p>
    </div>
  );
}

export default App;
