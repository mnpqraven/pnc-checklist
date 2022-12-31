"use client";

// deno workaround
// @deno-types="../../node_modules/@types/react/index.d.ts"
import React, { useRef, useState } from "react";

import { useTheme } from "next-themes";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [filePath, setFilePath] = useState<string | string[] | null>("");
  const inputFile = useRef<HTMLInputElement | null>(null);
  const [log, setLog] = useState("awaiting import");

  async function openImportDialog() {
    await open().then((e) => {
      setFilePath(e);
      invoke("import", { path: e })
        .then((chunk) => {
          setLog("importing");
          // TODO: test
          invoke("update_chunk", { chunk })
            .then(() => setLog("update successfully"));
        })
        .catch((err) => {
          console.log(err);
          setLog(`can't read file in ${err}`);
        });
    }); // filepath
  }
  async function openExportDialog() {
    // open().then(await invoke(''))
  }

  return (
    <>
      <h1>setting page</h1>
      <p>{log}</p>
      <input type="text" defaultValue={filePath} />
      <button onClick={openImportDialog}>choose directory</button>
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
    </>
  );
}
