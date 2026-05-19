export type CourseCategory =
  | "Тренировки"
  | "Похудение"
  | "Реабилитация"
  | "Питание"
  | "Ментальное";

export interface Course {
  slug: string;
  title: string;
  excerpt: string;
  category: CourseCategory;
  lessons: number;
  weeks: number;
  level: "Новичок" | "Средний" | "Продвинутый";
  author: string;
  gradient: string;
}

export const courseCategories: CourseCategory[] = [
  "Тренировки",
  "Похудение",
  "Реабилитация",
  "Питание",
  "Ментальное",
];

export const courses: Course[] = [
  {
    slug: "strength-foundations",
    title: "Сила с нуля: основы за 6 недель",
    excerpt: "Базовые движения, прогрессия нагрузки и безопасная техника — для тех, кто только начинает.",
    category: "Тренировки",
    lessons: 18,
    weeks: 6,
    level: "Новичок",
    author: "Анна Кравец",
    gradient: "from-emerald-400/40 to-teal-600/40",
  },
  {
    slug: "home-hypertrophy",
    title: "Гипертрофия дома: без зала, без оправданий",
    excerpt: "12-недельная программа с собственным весом и эспандерами.",
    category: "Тренировки",
    lessons: 36,
    weeks: 12,
    level: "Средний",
    author: "Анна Кравец",
    gradient: "from-teal-400/40 to-emerald-700/40",
  },
  {
    slug: "fat-loss-90",
    title: "Жиросжигание 90 дней",
    excerpt: "Питание, шаги, силовые и контроль психики — система, а не диета.",
    category: "Похудение",
    lessons: 24,
    weeks: 12,
    level: "Новичок",
    author: "Дмитрий Лосев",
    gradient: "from-lime-400/40 to-emerald-600/40",
  },
  {
    slug: "metabolic-reset",
    title: "Метаболический ресет: 4 недели",
    excerpt: "Восстановление чувствительности к инсулину через еду, сон и движение.",
    category: "Похудение",
    lessons: 16,
    weeks: 4,
    level: "Средний",
    author: "Дмитрий Лосев",
    gradient: "from-emerald-400/40 to-lime-600/40",
  },
  {
    slug: "knee-comeback",
    title: "Колено: возвращение в спорт",
    excerpt: "8 недель структурированной реабилитации — от боли до полной нагрузки.",
    category: "Реабилитация",
    lessons: 24,
    weeks: 8,
    level: "Средний",
    author: "Мария Орлова",
    gradient: "from-cyan-400/40 to-teal-600/40",
  },
  {
    slug: "back-resilience",
    title: "Здоровая спина: 6 недель",
    excerpt: "Мобильность, сила корпуса и осознанные паттерны движения.",
    category: "Реабилитация",
    lessons: 18,
    weeks: 6,
    level: "Новичок",
    author: "Игорь Васин",
    gradient: "from-teal-400/40 to-emerald-600/40",
  },
  {
    slug: "nutrition-basics",
    title: "Питание: разумные основы",
    excerpt: "Макросы, тайминг, привычки — без фанатизма и подсчёта каждого грамма.",
    category: "Питание",
    lessons: 12,
    weeks: 4,
    level: "Новичок",
    author: "Дмитрий Лосев",
    gradient: "from-yellow-400/30 to-emerald-600/40",
  },
  {
    slug: "mindful-month",
    title: "Осознанный месяц",
    excerpt: "Дыхание, медитация и работа со стрессом — 30 дней по 10 минут.",
    category: "Ментальное",
    lessons: 30,
    weeks: 4,
    level: "Новичок",
    author: "Софья Тренева",
    gradient: "from-emerald-300/40 to-green-700/40",
  },
];
