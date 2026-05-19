import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/Navbar";
import { BlobBackground } from "@/components/BlobBackground";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong max-w-md rounded-[28px] p-10 text-center">
        <h1 className="text-7xl font-bold text-slate-900">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-slate-900">Страница не найдена</h2>
        <p className="mt-2 text-sm text-on-glass">Возможно, она переехала или ещё не написана.</p>
        <Link to="/" className="btn-glass mt-6 inline-flex rounded-full px-5 py-2 text-sm">
          На главную
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong max-w-md rounded-[28px] p-10 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Что-то пошло не так</h1>
        <p className="mt-2 text-sm text-on-glass">Попробуйте обновить страницу.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="btn-glass mt-6 rounded-full px-5 py-2 text-sm"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HealthBlog — блог о здоровом образе жизни и тренировках" },
      { name: "description", content: "Тренировки, питание, восстановление, сон и ментальное здоровье — в одном месте." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <BlobBackground />
      <div className="relative min-h-screen pt-4 pb-16">
        <Navbar />
        <main className="mx-auto mt-8 w-full max-w-6xl px-4">
          <Outlet />
        </main>
        <footer className="mx-auto mt-16 w-full max-w-6xl px-4 text-center text-xs text-slate-400">
          © 2026 HealthBlog · Сделано с заботой о теле и уме
        </footer>
      </div>
    </QueryClientProvider>
  );
}
