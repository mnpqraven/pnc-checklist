/* @refresh reload */
import { render } from "solid-js/web";
import App from "./pages/App";
import { Route, Router, Routes } from "@solidjs/router";
import Dolls from "./pages/Dolls";
import Providers from "./components/Providers";

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

render(
  () => (
    <Providers>
      <Router>
        <Routes>
          <Route path="/" component={App} />
          <Route path="/dolls" component={Dolls} />
        </Routes>
      </Router>
    </Providers>
  ),
  document.getElementById("root") as HTMLElement
);
