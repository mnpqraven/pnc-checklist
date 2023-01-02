import Link from "next/link";

// const navigationRoutes = ['/', 'index_backup', 'about']
const navigationRoutes = [
  { route: "/", name: "Home" },
  { route: "dolls", name: "🍨🍨🍨" },
  // unimplemented
  // { route: "resources", name: "🍨🍨🍨" },
  // { route: 'summary', name: "Summary" },
  // { route: 'algo', name: "Algorithm" },
  // { route: 'about', name: "About" },
  { route: "settings", name: "🍨🍨🍨" },
];

const Navbar = () => {
  return (
    <nav className="h-full flex flex-col items-center fixed justify-center bg-gray-400">
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