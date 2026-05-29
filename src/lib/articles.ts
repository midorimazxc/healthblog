import { supabase } from "./supabase";

export type Category =
  | "Тренировки"
  | "Похудение"
  | "Реабилитация"
  | "Питание"
  | "Восстановление"
  | "Сон"
  | "Ментальное";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  readTime: number;
  author: string;
  date: string;
  tags: string[];
  gradient: string;
  content: string[];
}

export const categories: Category[] = [
  "Тренировки",
  "Похудение",
  "Реабилитация",
  "Питание",
  "Восстановление",
  "Сон",
  "Ментальное",
];

// ─── Fetch from Supabase ──────────────────────────────────────

export async function fetchArticles(): Promise<Article[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("articles")
    .select(`
      slug,
      title,
      excerpt,
      read_time,
      gradient,
      published_at,
      article_categories ( name ),
      authors ( name ),
      article_paragraphs ( position, body ),
      article_tags (
        tags ( name )
      )
    `)
    .order("published_at", { ascending: false });

  if (error || !data) {
    console.error("fetchArticles error:", error);
    return [];
  }

  return data.map((row: any) => ({
    slug:     row.slug,
    title:    row.title,
    excerpt:  row.excerpt,
    category: row.article_categories?.name as Category,
    readTime: row.read_time,
    author:   row.authors?.name ?? "",
    date:     formatDate(row.published_at),
    gradient: row.gradient ?? "from-emerald-400/40 to-teal-600/40",
    tags:     (row.article_tags ?? []).map((t: any) => t.tags?.name).filter(Boolean),
    content:  (row.article_paragraphs ?? [])
                .sort((a: any, b: any) => a.position - b.position)
                .map((p: any) => p.body),
  }));
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("articles")
    .select(`
      slug,
      title,
      excerpt,
      read_time,
      gradient,
      published_at,
      article_categories ( name ),
      authors ( name ),
      article_paragraphs ( position, body ),
      article_tags (
        tags ( name )
      )
    `)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return {
    slug:     data.slug,
    title:    data.title,
    excerpt:  data.excerpt,
    category: (data as any).article_categories?.name as Category,
    readTime: data.read_time,
    author:   (data as any).authors?.name ?? "",
    date:     formatDate(data.published_at),
    gradient: data.gradient ?? "from-emerald-400/40 to-teal-600/40",
    tags:     ((data as any).article_tags ?? []).map((t: any) => t.tags?.name).filter(Boolean),
    content:  ((data as any).article_paragraphs ?? [])
                .sort((a: any, b: any) => a.position - b.position)
                .map((p: any) => p.body),
  };
}

export async function fetchRelated(slug: string, limit = 3): Promise<Article[]> {
  if (!supabase) return [];

  // Сначала получаем category_id текущей статьи
  const { data: current } = await supabase
    .from("articles")
    .select("category_id")
    .eq("slug", slug)
    .single();

  if (!current) return [];

  const { data, error } = await supabase
    .from("articles")
    .select(`
      slug, title, excerpt, read_time, gradient, published_at,
      article_categories ( name ),
      authors ( name ),
      article_tags ( tags ( name ) )
    `)
    .eq("category_id", current.category_id)
    .neq("slug", slug)
    .limit(limit);

  if (error || !data) return [];

  return data.map((row: any) => ({
    slug:     row.slug,
    title:    row.title,
    excerpt:  row.excerpt,
    category: row.article_categories?.name as Category,
    readTime: row.read_time,
    author:   row.authors?.name ?? "",
    date:     formatDate(row.published_at),
    gradient: row.gradient ?? "from-emerald-400/40 to-teal-600/40",
    tags:     (row.article_tags ?? []).map((t: any) => t.tags?.name).filter(Boolean),
    content:  [],
  }));
}

// ─── Helpers ─────────────────────────────────────────────────

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

// Алиасы для совместимости с роутами
export const fetchRelatedArticles = fetchRelated;

export async function fetchCategories(): Promise<string[]> {
  if (!supabase) return categories;

  const { data, error } = await supabase
    .from("article_categories")
    .select("name")
    .order("name");

  if (error || !data) return categories;

  return data.map((c: any) => c.name);
}