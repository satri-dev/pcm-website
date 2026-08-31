"use client";

import { useState, useMemo } from "react";
import type { DownloadItem } from "../types";

export function useDownloads({
  items,
  categories,
}: {
  items: DownloadItem[];
  categories: string[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0] ?? "All"
  );
  const [searchQuery, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return items
      .filter((item) => {
        const matchCat =
          activeCategory === "All" || item.category === activeCategory;
        if (!matchCat) return false;
        if (!q) return true;
        const haystack = [item.title, item.fileName, item.description ?? ""]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }, [items, activeCategory, searchQuery]);

  return {
    filteredItems,
    activeCategory,
    setCategory: setActiveCategory,
    searchQuery,
    setSearch,
  };
}
