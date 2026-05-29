import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Dumbbell } from "lucide-react";
import { fetchArticles, fetchCategories, type Article } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { SearchBar } from "@/components/SearchBar";
import { Newsletter } from "@/components/Newsletter";

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      { title: "HealthBlog — здоровый образ жизни и тренировки" },
      { name: "description", content: "Свежие материалы о тренировках, питании, сне и восстановлении." },
    ],
  }),
  component: Home,
}));

function Home() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("Все");
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchArticles(), fetchCategories()]).then(([arts, cats]) => {
      setArticles(arts);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const matchesQ =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q));
      const matchesCat = active === "Все" || a.category === active;
      return matchesQ && matchesCat;
    });
  }, [query, active, articles]);

  return (
    <div className="space-y-14">
      {/* HERO */}
      <section className="glass-strong relative overflow-hidden rounded-[32px] p-8 sm:p-14">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#22c55e]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-10 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-slate-700 ring-1 ring-white/20">
            <Dumbbell className="h-3.5 w-3.5 text-[#15803d]" /> Новый сезон материалов
          </span>
          <h1 className="mt-5 text-4xl sm:text-6xl font-semibold tracking-tight text-slate-900 leading-[1.05]">
            Здоровье, которое <span className="text-[#15803d]">просвечивает</span> сквозь будни
          </h1>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-on-glass">
            Понятные материалы о тренировках, питании, сне и восстановлении.
            Никаких быстрых решений — только то, что работает в долгую.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/library/articles" className="btn-glass rounded-full px-5 py-2.5 text-sm font-medium inline-flex items-center gap-2">
              Статьи <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/library/courses" className="glass rounded-full px-5 py-2.5 text-sm text-slate-900 hover:bg-white/15 transition">
              Курсы
            </Link>
          </div>
        </div>
      </section>

      {/* SEARCH + FILTERS */}
      <section id="articles" className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">Свежие статьи</h2>
            <p className="text-sm text-on-glass">Найдено: {filtered.length}</p>
          </div>
          <div className="sm:w-96">
            <SearchBar value={query} onChange={setQuery} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["Все", ...categories]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-1.5 text-sm transition-all ${
                active === cat
                  ? "bg-[#22c55e]/30 text-slate-900 ring-1 ring-[#22c55e]/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                  : "glass text-slate-700 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-[20px] h-64 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-on-glass">
            Ничего не найдено. Попробуйте другой запрос.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a, i) => (
              <ArticleCard key={a.slug} article={a} index={i} />
            ))}
          </div>
        )}
      </section>

      <Newsletter />
    </div>
  );
}