import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";
import { THEME_CLASSES } from "@/utils/defaults";
import RadioGroup from "@/components/Form/RadioGroup";
import Button from "@/components/Button";

export default function Settings() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const [filePath, setFilePath] = useState("");
  // TODO: move log to context for overall logging
  const [log, setLog] = useState("awaiting import");
  const themeList = [...Object.keys(THEME_CLASSES), "system"];

  useEffect(() => setMounted(true), []);

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

  if (!mounted) return null;
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
          <Button onClick={openDefaultDialog} label={"Choose default file"} />
          <Button onClick={openImportDialog} label={"Import database"} />
          <Button onClick={openExportDialog} label={"Export database"} />
        </div>
        <RadioGroup value={theme} options={themeList} onChange={setTheme} />
        <div>
          <p>Assets from 42Lab wiki under CC BY-NC-SA</p>
          <p>Made with NextJS and Tauri</p>
        </div>
      </div>
    </main>
  );
}
