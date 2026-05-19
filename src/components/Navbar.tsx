import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

const links = [
  { to: "/", label: "Главная" },
  { to: "/categories", label: "Категории" },
  { to: "/profile", label: "Профиль" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-4 z-40 mx-auto w-full max-w-5xl px-4">
      <nav className="glass-strong flex items-center justify-between rounded-full px-5 py-3">
        <Link to="/" className="flex items-center gap-2 text-slate-900">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#22c55e] ring-1 ring-[#16a34a]">
            <Leaf className="h-4 w-4 text-white" />
          </span>
          <span className="text-sm font-semibold tracking-wide text-slate-900">HealthBlog</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-emerald-500/15 text-emerald-700" }}
              inactiveProps={{ className: "text-slate-600 hover:text-slate-900 hover:bg-slate-900/5" }}
              className="rounded-full px-3 py-1.5 text-sm transition-colors sm:px-4"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
