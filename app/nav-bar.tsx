import Link from "next/link";

// const navigationRoutes = ['/', 'index_backup', 'about']
const navigationRoutes = [
  { route: "/", name: "Home" },
  { route: "dolls", name: "🍨🍨🍨" },
  { route: "resources", name: "🍨🍨🍨" },
  // unimplemented
  // { route: 'summary', name: "Summary" },
  // { route: 'algo', name: "Algorithm" },
  // { route: 'about', name: "About" },
  { route: "settings", name: "🍨🍨🍨" },
];

export default function Navbar() {
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
