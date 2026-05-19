import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, Apple, Moon, Snowflake, Brain } from "lucide-react";
import { articles, categories, type Category } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Категории — HealthBlog" },
      { name: "description", content: "Тренировки, питание, восстановление, сон и ментальное здоровье." },
    ],
  }),
  component: CategoriesPage,
});

const meta: Record<Category, { icon: any; desc: string; gradient: string }> = {
  Тренировки: { icon: Activity, desc: "Сила, кардио, мобилити", gradient: "from-emerald-400/40 to-teal-600/40" },
  Питание: { icon: Apple, desc: "Макросы, тайминг, привычки", gradient: "from-lime-400/40 to-green-600/40" },
  Восстановление: { icon: Snowflake, desc: "Холод, тепло, мобилити", gradient: "from-cyan-400/40 to-emerald-600/40" },
  Сон: { icon: Moon, desc: "Циклы и циркадные ритмы", gradient: "from-teal-400/40 to-emerald-700/40" },
  Ментальное: { icon: Brain, desc: "Дыхание, устойчивость, практики", gradient: "from-emerald-300/40 to-green-700/40" },
};

function CategoriesPage() {
  const [active, setActive] = useState<Category>(categories[0]);
  const list = articles.filter((a) => a.category === active);

  return (
    <div className="space-y-10">
      <header className="glass-strong rounded-[28px] p-8 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-semibold text-white">Категории</h1>
        <p className="mt-2 text-on-glass">Выберите направление, которое сейчас важно для вас.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((c) => {
          const Icon = meta[c].icon;
          const isActive = active === c;
          return (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`glass glass-hover text-left rounded-2xl p-5 ${
                isActive ? "ring-2 ring-[#22c55e]/60 shadow-[0_0_30px_rgba(34,197,94,0.25)]" : ""
              }`}
            >
              <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${meta[c].gradient}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-3 font-semibold text-white">{c}</h3>
              <p className="mt-1 text-xs text-on-glass">{meta[c].desc}</p>
            </button>
          );
        })}
      </div>

      <section>
        <h2 className="mb-5 text-xl font-semibold text-white">
          {active} · {list.length}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a, i) => (
            <ArticleCard key={a.slug} article={a} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
