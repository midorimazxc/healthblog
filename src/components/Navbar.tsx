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
        <Link to="/" className="flex items-center gap-2 text-white">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#22c55e]/30 ring-1 ring-[#22c55e]/50">
            <Leaf className="h-4 w-4 text-[#bbf7d0]" />
          </span>
          <span className="text-sm font-semibold tracking-wide">HealthBlog</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-white/15 text-white" }}
              inactiveProps={{ className: "text-white/75 hover:text-white hover:bg-white/10" }}
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
