import Link from "next/link";

// const navigationRoutes = ['/', 'index_backup', 'about']
const navigationRoutes = [
  { route: "/", name: "Home" },
  { route: "dolls", name: "Dolls" },
  { route: "inventory", name: "Inventory" },
  { route: "settings", name: "Settings" },
  // unimplemented
  // { route: "resources", name: "🍨🍨🍨" },
  // { route: 'summary', name: "Summary" },
  // { route: 'about', name: "About" },
];

const Navbar = () => {
  return (
    <nav className="fixed left-1/2 flex -translate-x-1/2 items-center justify-center bg-gray-400">
      {navigationRoutes.map((route) => {
        return (
          <Link className="mx-4" href={route.route} key={route.route}>
            <span>{route.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
export default Navbar;
