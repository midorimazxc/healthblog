import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Target, Activity, Bookmark } from "lucide-react";
import { articles } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { useBookmarks } from "@/lib/bookmarks";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Профиль — HealthBlog" },
      { name: "description", content: "Ваши закладки, цели и активность." },
    ],
  }),
  component: ProfilePage,
});

const ACTIVITIES = ["Бег", "Силовые", "Йога", "Велосипед", "Плавание"];
const GOALS = ["Похудеть", "Набрать массу", "Поддерживать форму", "Больше энергии", "Лучше спать"];

function ProfilePage() {
  const { bookmarks } = useBookmarks();
  const [name, setName] = useState("");
  const [goal, setGoal] = useState(GOALS[2]);
  const [activity, setActivity] = useState(ACTIVITIES[1]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("healthblog:profile") || "{}");
    if (saved.name) setName(saved.name);
    if (saved.goal) setGoal(saved.goal);
    if (saved.activity) setActivity(saved.activity);
  }, []);

  useEffect(() => {
    localStorage.setItem("healthblog:profile", JSON.stringify({ name, goal, activity }));
  }, [name, goal, activity]);

  const saved = articles.filter((a) => bookmarks.includes(a.slug));

  return (
    <div className="space-y-10">
      <header className="glass-strong relative overflow-hidden rounded-[28px] p-8 sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#22c55e]/30 blur-3xl" />
        <div className="relative flex items-start gap-5">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#22c55e]/25 ring-1 ring-[#22c55e]/40">
            <User className="h-7 w-7 text-[#bbf7d0]" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-slate-900">
              {name || "Ваш профиль"}
            </h1>
            <p className="mt-1 text-on-glass">
              Цель: <span className="text-slate-900">{goal}</span> · Активность:{" "}
              <span className="text-slate-900">{activity}</span>
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-2xl p-6">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <User className="h-4 w-4" /> Имя
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Алекс"
            className="glass mt-3 w-full rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-900/40 outline-none focus:ring-2 focus:ring-[#22c55e]/50"
          />
        </div>

        <div className="glass rounded-2xl p-6">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <Target className="h-4 w-4" /> Цель
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`rounded-full px-3 py-1.5 text-xs transition ${
                  goal === g
                    ? "bg-[#22c55e]/30 text-slate-900 ring-1 ring-[#22c55e]/50"
                    : "bg-white/10 text-slate-600 hover:bg-white/15"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <Activity className="h-4 w-4" /> Вид активности
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {ACTIVITIES.map((a) => (
              <button
                key={a}
                onClick={() => setActivity(a)}
                className={`rounded-full px-3 py-1.5 text-xs transition ${
                  activity === a
                    ? "bg-[#22c55e]/30 text-slate-900 ring-1 ring-[#22c55e]/50"
                    : "bg-white/10 text-slate-600 hover:bg-white/15"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-5 flex items-center gap-2 text-2xl font-semibold text-slate-900">
          <Bookmark className="h-5 w-5 text-[#bbf7d0]" /> Закладки
          <span className="text-base font-normal text-slate-900/60">· {saved.length}</span>
        </h2>
        {saved.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-on-glass">
            Пока пусто. Сохраняйте статьи — они появятся здесь.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((a, i) => (
              <ArticleCard key={a.slug} article={a} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
