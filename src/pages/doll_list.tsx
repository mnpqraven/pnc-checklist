import { invoke } from "@tauri-apps/api/tauri";
import Link from "next/link";
import { useState, Dispatch, SetStateAction, ChangeEvent } from "react";
import { SkillResourceRequirement, UnitSkill } from "../model/infomodel";

function DollList() {
  const [slv, setSlv] = useState(1);
  const [slvAuto, setSlvAuto] = useState(1);
  const [skillRsc, setSkillRsc] = useState<SkillResourceRequirement>(
    { token: 0, pivot: 0, coin: 0 }
  );

  function slvInputHandle(e: ChangeEvent<HTMLInputElement>, setter: Dispatch<SetStateAction<number>>) {
    let val: number = parseInt(e.currentTarget.value);
    setter(val);
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
      <div className="row">
        <p>passive slv</p>
        <input
          id="slv-input"
          type="number"
          min="1"
          max="10"
          value={slv}
          onChange={(e) => slvInputHandle(e, setSlv)}
        />
        <p>auto slv</p>
        <input
          id="slv-input"
          type="number"
          min="1"
          max="10"
          value={slvAuto}
          onChange={(e) => slvInputHandle(e, setSlvAuto)}
        />
        <button type="button"
          onClick={() => calc_slv(slv)}>
          Calculate
        </button>
        <p>Skill resource needed:</p>
        <p>{skillRsc.token} tokens and {skillRsc.pivot} pivots needed</p>
        <button type="button">
          <Link href={"/"}>
            go to home
          </Link>
        </button>
      </div>
    </div>
  )
}
export default DollList;
