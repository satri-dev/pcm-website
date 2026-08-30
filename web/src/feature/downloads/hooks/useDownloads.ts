"use client";

import { useState, useMemo } from "react";
import type { DownloadCategory } from "../types";
import { downloadItems } from "../data/downloads";

export function useDownloads() {
  const [activeCategory, setActiveCategory] = useState<DownloadCategory>("All");
  const [searchQuery, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return downloadItems
      .filter((item) => {
        const matchCat =
          activeCategory === "All" || item.category === activeCategory;
        const matchQ =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
        return matchCat && matchQ;
      })
      .sort((a, b) => b.date.localeCompare(a.date)); // sort by date desc
  }, [activeCategory, searchQuery]);

  return {
    filteredItems,
    activeCategory,
    setCategory: setActiveCategory,
    searchQuery,
    setSearch,
  };
}
