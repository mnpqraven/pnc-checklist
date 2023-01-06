import { GrandResource } from "@/interfaces/datamodel";
import styles from "@/styles/Page.module.css";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

const Summary = () => {
  const [req, setReg] = useState<GrandResource>({
    skill: {token: 0, pivot: 0},
    coin: 0,
  });

  useEffect(() => {
    console.log("[mount] page resources");

    invoke<GrandResource>("get_needed_rsc").then((e) => setReg(e));
  }, []);

  return (
    <>
      <h1>amount needed:</h1>
      <p>token: {req.skill.token}</p>
      <p>pivot: {req.skill.pivot}</p>
      <p>coin: {req.coin}</p>
    </>
  );
};
export default Summary;
