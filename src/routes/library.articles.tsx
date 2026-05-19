import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { articles, categories, type Category } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";

export const Route = createFileRoute("/library/articles")({
  head: () => ({
    meta: [
      { title: "Статьи — HealthBlog" },
      { name: "description", content: "Статьи по тренировкам, похудению, реабилитации и питанию." },
    ],
  }),
  component: ArticlesPage,
});

function ArticlesPage() {
  const [active, setActive] = useState<Category | "Все">("Все");
  const list = active === "Все" ? articles : articles.filter((a) => a.category === active);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["Все", ...categories] as const).map((c) => {
          const isActive = active === c;
          return (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full px-4 py-1.5 text-sm transition-all ${
                isActive
                  ? "bg-[#22c55e]/30 text-slate-900 ring-1 ring-[#22c55e]/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                  : "glass text-slate-700 hover:text-slate-900"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <h2 className="text-xl font-semibold text-slate-900">
        {active} · {list.length}
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((a, i) => (
          <ArticleCard key={a.slug} article={a} index={i} />
        ))}
      </div>
    </section>
  );
}
