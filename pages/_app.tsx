import "@/styles/colors.css";
import "@/styles/globals.css";

import "@/styles/named.css";

import "@/styles/radix/alert.css";
import "@/styles/radix/button.css";
import "@/styles/radix/checkbox.css";
import "@/styles/radix/dropdownmenu.css";
import "@/styles/radix/label.css";
import "@/styles/radix/navigationmenu.css";
import "@/styles/radix/radiogroup.css";
import "@/styles/radix/select.css";
import "@/styles/radix/slider.css";
import "@/styles/radix/switch.css";
import "@/styles/radix/toast.css";
import "@/styles/radix/toggle.css";
import "@/styles/radix/togglegroup.css";

import "react-loading-skeleton/dist/skeleton.css";

import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { SkeletonTheme } from "react-loading-skeleton";
import Navbar from "@/components/Navbar";
import { THEME_CLASSES } from "@/utils/defaults";
// NOTE: needs to dynamically import provider component to force no SSR
// import Providers from "@/components/Toast/Providers";
import dynamic from "next/dynamic";

export default function App({ Component, pageProps }: AppProps) {
  const NoSSRProviders = dynamic(
    () => import("../components/Toast/Providers"),
    { ssr: false }
  );
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <ThemeProvider
        themes={Object.keys(THEME_CLASSES)}
        value={THEME_CLASSES}
        attribute="class"
      >
        <NoSSRProviders>
          <Navbar />
          <Component {...pageProps} />
        </NoSSRProviders>
      </ThemeProvider>
    </SkeletonTheme>
  );
}
