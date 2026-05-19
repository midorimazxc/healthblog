import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, Clock, Share2 } from "lucide-react";
import { getArticleBySlug, getRelated } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { useBookmarks } from "@/lib/bookmarks";

export const Route = createFileRoute("/article/$slug")({
  component: ArticlePage,
  notFoundComponent: () => (
    <div className="glass-strong rounded-[28px] p-10 text-center">
      <h1 className="text-2xl font-semibold text-white">Статья не найдена</h1>
      <Link to="/" className="btn-glass mt-6 inline-flex rounded-full px-5 py-2 text-sm">
        На главную
      </Link>
    </div>
  ),
  loader: ({ params }) => {
    const article = getArticleBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.article.title} — HealthBlog` },
          { name: "description", content: loaderData.article.excerpt },
        ]
      : [],
  }),
});

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const related = getRelated(article.slug);
  const { has, toggle } = useBookmarks();
  const saved = has(article.slug);

  return (
    <article className="space-y-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Назад
      </Link>

      <header className="glass-strong rounded-[28px] p-8 sm:p-12">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-[#22c55e]/25 px-3 py-1 text-[#bbf7d0] ring-1 ring-[#22c55e]/40">
            {article.category}
          </span>
          <span className="flex items-center gap-1 text-white/70">
            <Clock className="h-3.5 w-3.5" /> {article.readTime} мин
          </span>
          <span className="text-white/70">· {article.date}</span>
        </div>
        <h1 className="mt-4 text-3xl sm:text-5xl font-semibold leading-tight text-white">
          {article.title}
        </h1>
        <p className="mt-4 text-lg text-on-glass">{article.excerpt}</p>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-white/80">Автор · {article.author}</p>
          <div className="flex gap-2">
            <button
              onClick={() => toggle(article.slug)}
              className={`glass rounded-full p-2.5 transition ${
                saved ? "bg-[#22c55e]/25 ring-1 ring-[#22c55e]/40 text-[#bbf7d0]" : "text-white/80"
              }`}
              aria-label="Сохранить"
            >
              <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
            </button>
            <button className="glass rounded-full p-2.5 text-white/80" aria-label="Поделиться">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`h-64 sm:h-80 rounded-[28px] bg-gradient-to-br ${article.gradient} relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="glass rounded-[28px] p-8 sm:p-12 space-y-5">
        {article.content.map((p: string, i: number) => (
          <p key={i} className="text-lg leading-relaxed text-white/90">
            {p}
          </p>
        ))}

        <div className="flex flex-wrap gap-2 pt-4">
          {article.tags.map((tag: string) => (
            <span
              key={tag}
              className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/85 ring-1 ring-white/15"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="mb-5 text-2xl font-semibold text-white">Похожие материалы</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a, i) => (
              <ArticleCard key={a.slug} article={a} index={i} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
