import { SaveContext } from "@/interfaces/payloads";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import {
  ALERT_BUTTON_CANCEL,
  ALERT_BUTTON_CONTENT,
  ALERT_BUTTON_HEADER,
  ALERT_BUTTON_OK,
} from "@/utils/lang";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Alert from "./Alert";

const navigationRoutes = [
  { route: "/", name: "Home" },
  { route: "dolls", name: "Dolls" },
  { route: "inventory", name: "Inventory" },
  { route: "settings", name: "Settings" },
  // unimplemented
  // { route: "dev", name: "🍨🍨🍨" },
  // { route: 'summary', name: "Summary" },
  // { route: 'about', name: "About" },
];

const Navbar = () => {
  const { unsaved, setUnsaved } = useContext(SaveContext);
  const [openAlert, setOpenAlert] = useState(false);
  const router = useRouter();
  const [route, setRoute] = useState("");

  const content = {
    header: ALERT_BUTTON_HEADER,
    content: ALERT_BUTTON_CONTENT,
    cancel: ALERT_BUTTON_CANCEL,
    ok: ALERT_BUTTON_OK,
  };

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
      <RouteMenu routes={navigationRoutes} handleClick={handleClick} />
      <Alert
        open={openAlert}
        onCancel={onCancel}
        onAction={onAction}
        content={content}
      />
    </>
  );
};

type Props = {
  routes: { route: string; name: string }[];
  handleClick: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    route: string
  ) => void;
};
const RouteMenu = ({ routes, handleClick }: Props) => {
  return (
    <NavigationMenu.Root className="NavigationMenuRoot">
      <NavigationMenu.List className="NavigationMenuList">
        {routes.map(({ route, name }) => (
          <NavigationMenu.Item key={route}>
            <NavigationMenu.Link
              className="NavigationMenuLink"
              onClick={(e) => handleClick(e, route)}
            >
              {name}
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}

        <NavigationMenu.Indicator className="NavigationMenuIndicator">
          <div className="Arrow" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>

      <NavigationMenu.Viewport className="ViewportPosition" />
    </NavigationMenu.Root>
  );
};

export default Navbar;
