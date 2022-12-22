import Link from "next/link"

// const navigationRoutes = ['/', 'index_backup', 'about']
const navigationRoutes = [
  { route: '/', name: "Home" },
  { route: 'dolls', name: "Dolls" },
  { route: 'resources', name: "General Resources" },
  { route: 'summary', name: "Summary" },
  { route: 'algo', name: "Algorithm" },
  { route: 'about', name: "About" },
]

export const Navbar = () => {
  return (
    <nav className="flex flex-col fixed h-full bg-gray-400 ">
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
