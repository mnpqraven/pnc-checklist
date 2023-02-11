import { SaveContext, ToastContext } from "@/interfaces/payloads";
import React, { ReactNode } from "react";
import { useState } from "react";
import Toast from "./Toast";

type Props = { children: ReactNode };

const ToastProvider = ({ children }: Props) => {
  const [unsaved, setUnsaved] = useState(false);
  const updateUnsaved = (to: boolean) => {
    setUnsaved(to);
  };

  // TODO: refactor
  const [open, setOpen] = useState(false);
  const [header, setHeader] = useState("");
  const [content, setContent] = useState("");
  const timerRef = React.useRef(0);

  const setHeaderContent = (header = "", content = "") => {
    setHeader(header);
    setContent(content);
  };

  function fireToast() {
    setOpen(false);

    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, 100);
  }
  return (
    <ToastContext.Provider
      value={{ open, setOpen, header, content, setHeaderContent, fireToast }}
    >
      <SaveContext.Provider value={{ unsaved, setUnsaved: updateUnsaved }}>
        {children}

        <Toast
          open={open}
          setOpen={setOpen}
          header={header}
          content={content}
        />
      </SaveContext.Provider>
    </ToastContext.Provider>
  );
};
export default ToastProvider;
