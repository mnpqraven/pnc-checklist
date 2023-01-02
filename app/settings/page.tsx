"use client";
import { useRef, useState } from "react";
import { useTheme } from "next-themes";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";
import styles from "@/app/page.module.css";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [filePath, setFilePath] = useState("");
  // TODO: move log to context for overall logging
  const [log, setLog] = useState("awaiting import");

  async function openImportDialog() {
    await open().then((e) => {
      if (typeof e == "string") {
        invoke("import", { path: e })
          .then((chunk) => {
            setLog("importing");
            invoke("update_chunk", { chunk }).then(() =>
              setLog("update successfully")
            );
          })
          .catch((err) => {
            console.log(err);
            setLog(`can't read file in ${err}`);
          });
      }
    }); // filepath
  }
  async function openExportDialog() {
    await open({
      directory: true,
    }).then((e) => {
      invoke("export", { path: e });
    });
  }
  async function openDefaultDialog() {
    await open({
      filters: [
        {
          name: "JSON file",
          extensions: ["json", "jsonc"],
        },
      ],
    }).then((file) => {
      invoke("set_default_file", { file });
    });
  }

  return (
    <>
      <div className={`${styles.component_space}  flex flex-col`}>
        <h1>setting page</h1>
        <p>{log}</p>
        <label>
          File read during startup
          <input type="text" defaultValue={filePath} />
        </label>
        <div className="flex">
          <button onClick={openDefaultDialog}>Choose default file</button>
          <button onClick={openImportDialog}>Import database</button>
          <button onClick={openExportDialog}>Export database</button>
        </div>
        <p>current theme:</p>
        <label>
          <input
            type="radio"
            checked={theme === "dark"}
            onChange={() => setTheme("dark")}
          />
          Dark mode
        </label>
        <label>
          <input
            type="radio"
            checked={theme === "light"}
            onChange={() => setTheme("light")}
          />
          Light mode
        </label>
        <label>
          <input
            type="radio"
            checked={theme === "system"}
            onChange={() => setTheme("system")}
          />
          System color
        </label>
      </div>
    </>
  );
}
