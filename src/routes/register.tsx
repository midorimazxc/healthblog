import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { User, Mail, Lock, UserPlus } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Регистрация — HealthBlog" },
      { name: "description", content: "Создайте аккаунт HealthBlog." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // UI only — no auth logic yet
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="glass-strong relative overflow-hidden rounded-[28px] p-8 sm:p-10">
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-emerald-400/30 blur-3xl" />
        <div className="relative">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#22c55e]/25 ring-1 ring-[#22c55e]/40">
            <UserPlus className="h-5 w-5 text-[#15803d]" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold text-slate-900">Создать аккаунт</h1>
          <p className="mt-1 text-on-glass">Сохраняйте статьи и отслеживайте прогресс.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="flex items-center gap-2 text-sm text-slate-700">
                <User className="h-4 w-4" /> Имя
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Алекс"
                className="glass mt-2 w-full rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-900/40 outline-none focus:ring-2 focus:ring-[#22c55e]/50"
              />
            </label>

            <label className="block">
              <span className="flex items-center gap-2 text-sm text-slate-700">
                <Mail className="h-4 w-4" /> Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="glass mt-2 w-full rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-900/40 outline-none focus:ring-2 focus:ring-[#22c55e]/50"
              />
            </label>

            <label className="block">
              <span className="flex items-center gap-2 text-sm text-slate-700">
                <Lock className="h-4 w-4" /> Пароль
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Минимум 8 символов"
                className="glass mt-2 w-full rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-900/40 outline-none focus:ring-2 focus:ring-[#22c55e]/50"
              />
            </label>

            <button type="submit" className="btn-glass w-full rounded-full px-5 py-2.5 text-sm font-medium">
              Зарегистрироваться
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-on-glass">
            Уже есть аккаунт?{" "}
            <Link to="/login" className="font-medium text-[#15803d] hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
