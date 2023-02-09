import "@/styles/colors.css";
import "@/styles/globals.css";
import "@/styles/named.css";
import "@/styles/radix.css";
import "@/styles/alert.css";
import "@/styles/togglegroup.css";
import "react-loading-skeleton/dist/skeleton.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SkeletonTheme } from "react-loading-skeleton";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { SaveContext } from "@/interfaces/payloads";

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
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <SaveContext.Provider value={{ unsaved, setUnsaved: updateUnsaved }}>
            <Navbar />
            <Component {...pageProps} />
          </SaveContext.Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </SkeletonTheme>
  );
}
