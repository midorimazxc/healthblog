import { useEffect, useState } from "react";

const KEY = "healthblog:bookmarks";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    setBookmarks(read());
    const onStorage = () => setBookmarks(read());
    window.addEventListener("storage", onStorage);
    window.addEventListener("bookmarks:changed", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("bookmarks:changed", onStorage);
    };
  }, []);

  const toggle = (slug: string) => {
    const current = read();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("bookmarks:changed"));
    setBookmarks(next);
  };

  return { bookmarks, toggle, has: (slug: string) => bookmarks.includes(slug) };
}
