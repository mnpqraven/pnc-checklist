import "@/styles/colors.css";
import "@/styles/globals.css";

import "@/styles/named.css";

import "@/styles/radix/radix.css";
import "@/styles/radix/alert.css";
import "@/styles/radix/button.css";
import "@/styles/radix/togglegroup.css";
import "@/styles/radix/slider.css";
import "@/styles/radix/toast.css";
import "@/styles/radix/navigationmenu.css";
import "@/styles/radix/select.css";

import "react-loading-skeleton/dist/skeleton.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SkeletonTheme } from "react-loading-skeleton";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { SaveContext, ToastContext } from "@/interfaces/payloads";
import Toast from "@/components/Toast";
import { THEME_CLASSES } from "@/utils/defaults";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
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
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <ThemeProvider
        themes={Object.keys(THEME_CLASSES)}
        value={THEME_CLASSES}
        attribute="class"
      >
        <QueryClientProvider client={queryClient}>
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
              value={{ unsaved, setUnsaved: updateUnsaved }}
            >
              <Navbar />
              <Component {...pageProps} />
              <Toast
                open={open}
                setOpen={setOpen}
                header={header}
                content={content}
              />
            </SaveContext.Provider>
          </ToastContext.Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </SkeletonTheme>
  );
}
