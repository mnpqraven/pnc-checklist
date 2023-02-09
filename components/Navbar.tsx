import { SaveContext } from "@/interfaces/payloads";
import {
  ALERT_BUTTON_CANCEL,
  ALERT_BUTTON_CONTENT,
  ALERT_BUTTON_HEADER,
  ALERT_BUTTON_OK,
} from "@/utils/lang";
import { useRouter } from "next/router";
import { MouseEventHandler, useContext, useState } from "react";
import Alert from "./Alert";

// const navigationRoutes = ['/', 'index_backup', 'about']
const navigationRoutes = [
  { route: "/", name: "Home" },
  { route: "dolls", name: "Dolls" },
  { route: "inventory", name: "Inventory" },
  { route: "settings", name: "Settings" },
  // unimplemented
  { route: "dev", name: "🍨🍨🍨" },
  // { route: 'summary', name: "Summary" },
  // { route: 'about', name: "About" },
];

const Navbar = () => {
  // FIX: cause DollContext and dollData to turn undefined
  const { unsaved, setUnsaved } = useContext(SaveContext);

  const [openAlert, setOpenAlert] = useState(false);
  const router = useRouter();
  const [route, setRoute] = useState("");

  function handleClick(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    nextRoute: string
  ) {
    setRoute(nextRoute);
    e.preventDefault();
    if (unsaved) setOpenAlert(true);
    else router.push(nextRoute);
  }

  function onCancel() {
    setOpenAlert(false);
  }

  function onAction() {
    setOpenAlert(false);
    setUnsaved(false);
    router.push(route);
  }

  return (
    <>
      <nav className="fixed left-1/2 flex -translate-x-1/2 items-center justify-center bg-gray-400">
        {navigationRoutes.map((route) => (
          <a
            className="mx-4"
            href={route.route}
            key={route.route}
            onClick={(e) => handleClick(e, route.route)}
          >
            <span>{route.name}</span>
          </a>
        ))}
      </nav>
      <Alert
        open={openAlert}
        onCancel={onCancel}
        onAction={onAction}
        content={{
          header: ALERT_BUTTON_HEADER,
          content: ALERT_BUTTON_CONTENT,
          cancel: ALERT_BUTTON_CANCEL,
          ok: ALERT_BUTTON_OK,
        }}
      />
    </>
  );
};
export default Navbar;
