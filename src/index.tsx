/* @refresh reload */
import { render } from "solid-js/web";
import "./style.css";
import App from "./pages/App";
import { Route, Router, Routes } from "@solidjs/router";
import Dolls from "./pages/Dolls";
import rspc, { client, queryClient } from "./rspc";

render(
  () => (
    <rspc.Provider client={client} queryClient={queryClient}>
    <Router>
      <Routes>
        <Route path="/" component={App} />
        <Route path="/dolls" component={Dolls} />
      </Routes>
    </Router>
    </rspc.Provider>
  ),
  document.getElementById("root") as HTMLElement
);
