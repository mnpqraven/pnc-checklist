"use client";
import { SaveContext, ToastContext } from "@/interfaces/payloads";
import { Procedures } from "@/src-tauri/bindings/rspc";
import {
  Client,
  ClientArgs,
  inferProcedures,
  ProceduresLike,
} from "@rspc/client";
import { createReactQueryHooks } from "@rspc/react";
import { TauriTransport } from "@rspc/tauri";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode, useEffect } from "react";
import { useState } from "react";
import Toast from "./Toast";

type Props = { children: ReactNode };
let queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
export const rspc = createReactQueryHooks<Procedures>();
export let rspcClient: Client<Procedures>;

type rspcClientType = {
  createClient: <TProcedures extends ProceduresLike>(
    args: ClientArgs
  ) => Client<inferProcedures<TProcedures>>;
};
if (typeof window !== "undefined") {
  const { createClient }: rspcClientType = require("@rspc/client");
  const { TauriTransport } = require("@rspc/tauri");
  rspcClient = createClient<Procedures>({
    transport: new TauriTransport(),
  });
}
const Providers = ({ children }: Props) => {
  const [isUnsaved, setUnsaved] = useState(false);
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
    <QueryClientProvider client={queryClient}>
      <rspc.Provider client={rspcClient} queryClient={queryClient}>
        <ToastContext.Provider
          value={{
            open,
            setOpen,
            header,
            content,
            setHeaderContent,
            fireToast,
          }}
        >
          <SaveContext.Provider
            value={{ isUnsaved, setUnsaved: updateUnsaved }}
          >
            {children}
            <Toast
              open={open}
              setOpen={setOpen}
              header={header}
              content={content}
            />
          </SaveContext.Provider>
        </ToastContext.Provider>
      </rspc.Provider>
    </QueryClientProvider>
  );
};
export default Providers;
