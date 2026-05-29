import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  User, Target, Activity, Bookmark,
  ChevronLeft, ChevronRight, Check, ArrowRight, Zap, Leaf,
} from "lucide-react";
import { fetchArticles, type Article } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { useBookmarks } from "@/lib/bookmarks";
import { supabase } from "@/lib/supabase";

// ─── Route ───────────────────────────────────────────────────

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Профиль — HealthBlog" },
      { name: "description", content: "Ваши закладки, цели и активность." },
    ],
  }),
  component: ProfilePage,
});

// ─── Types ───────────────────────────────────────────────────

export type WorkoutType = "strength" | "cardio" | "yoga";

export interface WorkoutSession {
  id: number;
  title: string;
  subtitle: string | null;
  type: WorkoutType;
  duration: number;
  scheduled_at: string;   // ISO string
  completed: boolean;     // вычисляется на клиенте из workout_logs
}

// ─── Constants ───────────────────────────────────────────────

const ACTIVITIES = ["Бег", "Силовые", "Йога", "Велосипед", "Плавание"];
const GOALS      = ["Похудеть", "Набрать массу", "Поддерживать форму", "Больше энергии", "Лучше спать"];

const DOT_COLOR: Record<WorkoutType, string> = {
  strength: "bg-emerald-500",
  cardio:   "bg-teal-400",
  yoga:     "bg-sky-400",
};

const MONTHS_RU = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const DAYS_RU   = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

// Демо-пользователь, пока нет настоящей авторизации
const DEMO_USER_ID = 1;

// ─── Supabase helpers ─────────────────────────────────────────

async function fetchWorkoutSessions(userId: number, year: number, month: number): Promise<WorkoutSession[]> {
  if (!supabase) return [];

  const from = new Date(year, month, 1).toISOString();
  const to   = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  // Сессии за месяц
  const { data: sessions, error: sErr } = await supabase
    .from("workout_sessions")
    .select("id, title, subtitle, type, duration, scheduled_at")
    .eq("user_id", userId)
    .gte("scheduled_at", from)
    .lte("scheduled_at", to)
    .order("scheduled_at");

  if (sErr || !sessions) return [];

  // Логи выполненных тренировок за тот же период
  const sessionIds = sessions.map((s) => s.id);
  const { data: logs } = await supabase
    .from("workout_logs")
    .select("workout_session_id")
    .eq("user_id", userId)
    .in("workout_session_id", sessionIds);

  const completedIds = new Set((logs ?? []).map((l: any) => l.workout_session_id));

  return sessions.map((s: any) => ({
    ...s,
    completed: completedIds.has(s.id),
  }));
}

async function toggleSessionComplete(userId: number, session: WorkoutSession) {
  if (!supabase) return;

  if (session.completed) {
    // Снимаем отметку
    await supabase
      .from("workout_logs")
      .delete()
      .eq("user_id", userId)
      .eq("workout_session_id", session.id);
  } else {
    // Отмечаем выполненным
    await supabase
      .from("workout_logs")
      .insert({ user_id: userId, workout_session_id: session.id, type: session.type });
  }
}

// ─── Calendar ────────────────────────────────────────────────

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDow(y: number, m: number)    { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }

function MiniCalendar({ sessions }: { sessions: WorkoutSession[] }) {
  const now = new Date();
  const [cur, setCur] = useState({ year: now.getFullYear(), month: now.getMonth() });

  const dim      = getDaysInMonth(cur.year, cur.month);
  const firstDow = getFirstDow(cur.year, cur.month);

  const prev = () => setCur((c) => c.month === 0  ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 });
  const next = () => setCur((c) => c.month === 11 ? { year: c.year + 1, month: 0  } : { ...c, month: c.month + 1 });

  // Собираем точки из реальных сессий
  const dotMap = new Map<number, WorkoutType>();
  sessions.forEach((s) => {
    const d = new Date(s.scheduled_at);
    if (d.getFullYear() === cur.year && d.getMonth() === cur.month) {
      dotMap.set(d.getDate(), s.type);
    }
  });

  const cells: (number | null)[] = Array(firstDow).fill(null);
  for (let i = 1; i <= dim; i++) cells.push(i);
  while (cells.length % 7 !== 0) cells.push(null);

  const isCurrentMonth = cur.year === now.getFullYear() && cur.month === now.getMonth();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={prev} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#22c55e]/10 transition text-slate-500">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-slate-700">
          {MONTHS_RU[cur.month]} {cur.year}
        </span>
        <button onClick={next} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#22c55e]/10 transition text-slate-500">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {DAYS_RU.map((d) => (
          <div key={d} className="text-center text-xs text-slate-400 font-medium py-1">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) {
            return (
              <div key={`e-${i}`} className="flex flex-col items-center py-0.5">
                <span className="text-xs w-7 h-7 flex items-center justify-center text-slate-300" />
                <span className="w-1.5 h-1.5 mt-0.5" />
              </div>
            );
          }
          const isToday = isCurrentMonth && day === now.getDate();
          const dot     = dotMap.get(day);
          return (
            <div key={day} className="flex flex-col items-center py-0.5">
              <span className={`text-xs w-7 h-7 flex items-center justify-center rounded-full transition
                ${isToday ? "bg-[#16a34a] text-white font-semibold" : "text-slate-700 hover:bg-[#22c55e]/10 cursor-pointer"}`}>
                {day}
              </span>
              {dot
                ? <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${DOT_COLOR[dot]}`} />
                : <span className="w-1.5 h-1.5 mt-0.5" />}
            </div>
          );
        })}
      </div>

      {/* Легенда */}
      <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Силовая</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-400 inline-block" /> Кардио</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400 inline-block" /> Йога</span>
      </div>
    </div>
  );
}

// ─── Session row ──────────────────────────────────────────────

function SessionIcon({ type }: { type: WorkoutType }) {
  if (type === "yoga") return <Leaf className="w-4 h-4 text-sky-500" />;
  return <Zap className={`w-4 h-4 ${type === "strength" ? "text-[#15803d]" : "text-teal-500"}`} />;
}

function SessionRow({
  s,
  onToggle,
}: {
  s: WorkoutSession;
  onToggle: (s: WorkoutSession) => void;
}) {
  const d    = new Date(s.scheduled_at);
  const day  = d.getDate();
  const dow  = DAYS_RU[(d.getDay() + 6) % 7];
  const time = d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  return (
    <button
      onClick={() => onToggle(s)}
      className={`w-full text-left flex items-center gap-3 rounded-2xl px-4 py-3 transition
        ${s.completed ? "bg-[#22c55e]/10 border border-[#22c55e]/20" : "glass hover:bg-white/80"}`}
    >
      <div className="w-10 text-center flex-shrink-0">
        <div className="text-base font-bold text-slate-800 leading-none">{day}.</div>
        <div className="text-[11px] text-slate-400 mt-0.5">{dow}</div>
      </div>

      <SessionIcon type={s.type} />

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-800 truncate">{s.title}</div>
        {s.subtitle && <div className="text-xs text-slate-400 truncate">{s.subtitle}</div>}
      </div>

      <div className="flex-shrink-0">
        {s.completed
          ? <Check className="w-4 h-4 text-[#15803d]" />
          : <ArrowRight className="w-4 h-4 text-slate-300" />}
      </div>

      <div className="flex-shrink-0 text-right">
        <div className="text-xs font-medium text-slate-600">{s.duration} мин</div>
        <div className="text-xs text-slate-400">{time}</div>
      </div>
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────

function ProfilePage() {
  const { bookmarks }  = useBookmarks();
  const [name,     setName]     = useState("");
  const [goal,     setGoal]     = useState(GOALS[2]);
  const [activity, setActivity] = useState(ACTIVITIES[1]);

  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [sessions,    setSessions]    = useState<WorkoutSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const now = new Date();

  // Профиль из localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("healthblog:profile") || "{}");
    if (saved.name)     setName(saved.name);
    if (saved.goal)     setGoal(saved.goal);
    if (saved.activity) setActivity(saved.activity);
  }, []);

  useEffect(() => {
    localStorage.setItem("healthblog:profile", JSON.stringify({ name, goal, activity }));
  }, [name, goal, activity]);

  // Статьи из закладок
  useEffect(() => {
    if (bookmarks.length > 0) fetchArticles().then(setAllArticles);
  }, [bookmarks.length]);

  // Тренировки из Supabase
  useEffect(() => {
    setLoadingSessions(true);
    fetchWorkoutSessions(DEMO_USER_ID, now.getFullYear(), now.getMonth())
      .then(setSessions)
      .finally(() => setLoadingSessions(false));
  }, []);

  // Тоггл выполнения — оптимистичное обновление
  const handleToggle = async (s: WorkoutSession) => {
    setSessions((prev) =>
      prev.map((x) => x.id === s.id ? { ...x, completed: !x.completed } : x)
    );
    await toggleSessionComplete(DEMO_USER_ID, s);
  };

  const savedArticles = allArticles.filter((a) => bookmarks.includes(a.slug));

  return (
    <div className="space-y-10">

      {/* ── Profile header ────────────────────────────── */}
      <header className="glass-strong relative overflow-hidden rounded-[28px] p-8 sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#22c55e]/30 blur-3xl" />
        <div className="relative flex items-start gap-5">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#22c55e]/25 ring-1 ring-[#22c55e]/40">
            <User className="h-7 w-7 text-[#15803d]" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-slate-900">{name || "Ваш профиль"}</h1>
            <p className="mt-1 text-on-glass flex flex-wrap items-center gap-1.5">
              Цель: <span className="text-slate-900">{goal}</span>
              <span className="text-slate-400">·</span>
              Активность:{" "}
              <span className="inline-flex items-center rounded-full bg-[#22c55e]/20 text-[#15803d] text-xs font-medium px-2.5 py-0.5 ring-1 ring-[#22c55e]/30">
                {activity}
              </span>
            </p>
          </div>
        </div>
      </header>

      {/* ── Calendar + Workout plan ────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4 text-sm font-medium text-slate-700">
            <span className="text-base">📅</span> Календарь
          </div>
          <MiniCalendar sessions={sessions} />
        </section>

        <section className="glass rounded-2xl p-5">
          <h2 className="text-base font-semibold text-slate-800 mb-4">
            План тренировок
            {!loadingSessions && sessions.length > 0 && (
              <span className="ml-2 text-xs font-normal text-slate-400">
                {sessions.filter((s) => s.completed).length}/{sessions.length} выполнено
              </span>
            )}
          </h2>

          {loadingSessions ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass rounded-2xl h-16 animate-pulse" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center text-sm text-slate-400 py-8">
              Тренировок на этот месяц нет
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((s) => (
                <SessionRow key={s.id} s={s} onToggle={handleToggle} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Settings ──────────────────────────────────── */}
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
              <button key={g} onClick={() => setGoal(g)}
                className={`rounded-full px-3 py-1.5 text-xs transition ${
                  goal === g ? "bg-[#22c55e]/30 text-slate-900 ring-1 ring-[#22c55e]/50" : "bg-white/10 text-slate-600 hover:bg-white/20"
                }`}>
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
              <button key={a} onClick={() => setActivity(a)}
                className={`rounded-full px-3 py-1.5 text-xs transition ${
                  activity === a ? "bg-[#22c55e]/30 text-slate-900 ring-1 ring-[#22c55e]/50" : "bg-white/10 text-slate-600 hover:bg-white/20"
                }`}>
                {a}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bookmarks ─────────────────────────────────── */}
      <section>
        <h2 className="mb-5 flex items-center gap-2 text-2xl font-semibold text-slate-900">
          <Bookmark className="h-5 w-5 text-[#15803d]" /> Закладки
          <span className="text-base font-normal text-slate-900/60">· {bookmarks.length}</span>
        </h2>
        {bookmarks.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-on-glass">
            Пока пусто. Сохраняйте статьи — они появятся здесь.
          </div>
        ) : savedArticles.length === 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: bookmarks.length }).map((_, i) => (
              <div key={i} className="glass rounded-[20px] h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedArticles.map((a, i) => (
              <ArticleCard key={a.slug} article={a} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}