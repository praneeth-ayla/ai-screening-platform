import Link from "next/link";

const links = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    name: "Jobs",
    href: "/admin/jobs",
  },
];

export function AdminSidebar() {
  return (
    <aside className="w-64 border-r min-h-screen p-4">
      <div className="mb-8 text-xl font-bold">Admin</div>

      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-lg px-3 py-2 hover:bg-muted"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
