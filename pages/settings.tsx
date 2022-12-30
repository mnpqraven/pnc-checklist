import styles from "@/styles/Home.module.css";
import { useTheme } from "next-themes";
import { useState } from "react";
const Settings = () => {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <h1>setting page</h1>
      <p>current theme is {theme}</p>
      <p>use system color ?</p> {/**yes /no, if no clickable */}
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
};
export default Settings;
