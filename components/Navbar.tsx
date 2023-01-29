import Link from "next/link";

// const navigationRoutes = ['/', 'index_backup', 'about']
const navigationRoutes = [
  { route: "/", name: "Home" },
  { route: "dolls", name: "Dolls" },
  { route: 'inventory', name: "Inventory" },
  { route: "settings", name: "Settings" },
  // unimplemented
  // { route: "resources", name: "🍨🍨🍨" },
  // { route: 'summary', name: "Summary" },
  // { route: 'about', name: "About" },
];

const Navbar = () => {
  return (
    <nav className="w-full flex items-center fixed justify-center bg-gray-400">
      {navigationRoutes.map((route) => {
        return (
          <Link href={route.route} key={route.route}>
            <span>{route.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
export default Navbar
