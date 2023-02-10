import { useState } from "react";
import { useTheme } from "next-themes";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [filePath, setFilePath] = useState("");
  // TODO: move log to context for overall logging
  const [log, setLog] = useState("awaiting import");

  const themeList = ["light", "dark", "red", "system"];

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
      if (file && typeof file == "string") setFilePath(file);
      invoke("set_default_file", { file });
    });
  }

  return (
    <main>
      <div className="component_space flex flex-col">
        <h1>setting page</h1>
        <p>{log}</p>
        <label>
          File read during startup
          <input type="text" disabled defaultValue={filePath} />
        </label>
        <div className="flex">
          <button onClick={openDefaultDialog}>Choose default file</button>
          <button onClick={openImportDialog}>Import database</button>
          <button onClick={openExportDialog}>Export database</button>
        </div>
        {themeList.map((th, index) => (
          <label key={index}>
            <input
              key={index}
              type="radio"
              checked={theme === th}
              onChange={() => setTheme(th)}
            />
            {th}
          </label>
        ))}
        <div>
          <p>assets from 42Lab wiki under CC BY-NC-SA</p>
          <p>made with NextJS and Tauri</p>
        </div>
      </div>
    </main>
  );
}
