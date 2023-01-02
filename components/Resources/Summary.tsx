import { GrandResource } from "@/interfaces/datamodel";
import styles from "@/styles/Page.module.css";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

const Summary = () => {
  const [req, setReg] = useState<GrandResource>({
    slv_token: 0,
    slv_pivot: 0,
    coin: 0,
  });

  useEffect(() => {
    console.log("[mount] page resources");

    invoke<GrandResource>("get_needed_rsc").then((e) => setReg(e));
  }, []);

  return (
    <>
      <h1>amount needed:</h1>
      <p>token: {req.slv_token}</p>
      <p>pivot: {req.slv_pivot}</p>
      <p>coin: {req.coin}</p>
    </>
  );
};
export default Summary;
