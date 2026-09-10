"use client";

import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  // Initialize state with a function to avoid unnecessary re-renders
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;

    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem("theme");

    // Default to light mode unless explicitly set to dark
    return savedTheme === "dark";
  });

  useEffect(() => {
    // Apply the theme to the document on mount and when isDark changes
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 sm:w-10 sm:h-10 grid place-items-center rounded-md border border-border text-pcm-navy hover:text-pcm-blue hover:border-pcm-blue hover:bg-secondary transition-all"
    >
      {isDark ? (
        <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
      ) : (
        <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
      )}
    </button>
  );
}
