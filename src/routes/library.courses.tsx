import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Clock, GraduationCap } from "lucide-react";
import { courses, courseCategories, type CourseCategory } from "@/lib/courses";

export const Route = createFileRoute("/library/courses")({
  head: () => ({
    meta: [
      { title: "Курсы — HealthBlog" },
      { name: "description", content: "Системные курсы по тренировкам, похудению и реабилитации." },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const [active, setActive] = useState<CourseCategory | "Все">("Все");
  const list = active === "Все" ? courses : courses.filter((c) => c.category === active);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["Все", ...courseCategories] as const).map((c) => {
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
        {list.map((course, i) => (
          <article
            key={course.slug}
            className="glass glass-hover animate-fade-up group relative overflow-hidden rounded-[20px] p-5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div
              className={`mb-4 h-40 rounded-2xl bg-gradient-to-br ${course.gradient} relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-white/15 px-3 py-1 text-xs text-slate-900 backdrop-blur-md ring-1 ring-white/20">
                {course.category}
              </span>
              <span className="absolute right-3 top-3 rounded-full bg-[#22c55e]/30 px-3 py-1 text-xs text-slate-900 backdrop-blur-md ring-1 ring-[#22c55e]/40">
                {course.level}
              </span>
              <GraduationCap className="absolute bottom-3 right-3 h-8 w-8 text-white/70" />
            </div>

            <h3 className="text-lg font-semibold text-slate-900 leading-snug group-hover:text-[#15803d] transition-colors">
              {course.title}
            </h3>
            <p className="mt-2 text-sm text-on-glass line-clamp-2">{course.excerpt}</p>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" /> {course.lessons} уроков
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {course.weeks} нед.
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
