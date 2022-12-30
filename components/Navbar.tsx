import Link from "next/link"

// const navigationRoutes = ['/', 'index_backup', 'about']
const navigationRoutes = [
  { route: '/', name: "Home" },
  { route: 'dolls', name: "Dolls" },
  { route: 'resources', name: "General Resources" },
  // unimplemented
  // { route: 'summary', name: "Summary" },
  // { route: 'algo', name: "Algorithm" },
  // { route: 'about', name: "About" },
  { route: 'settings', name: "Settings" },
]

export const Navbar = () => {
  return (
    <nav className="h-full flex flex-col items-center justify-center fixed bg-gray-400">
      {navigationRoutes.map((singleRoute) => {
        return (
          <Link
            href={singleRoute.route}
            key={singleRoute.route}
          >
            <span>{singleRoute.name} </span>
          </Link>
        )
      })}
    </nav>
  )
}
