"use client";

import { useEffect, useRef } from "react";

export default function ThemeToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const theme = saved === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    if (buttonRef.current) {
      buttonRef.current.setAttribute("data-theme", theme);
    }
  }, []);

  function toggle() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    if (buttonRef.current) {
      buttonRef.current.setAttribute("data-theme", next);
    }
  }

  return (
    <button
      ref={buttonRef}
      onClick={toggle}
      data-theme="dark"
      aria-label="Toggle theme"
      className="fixed top-4 right-4 z-50 w-9 h-9 flex items-center justify-center rounded-full border border-accent/40 bg-card text-accent-text hover:bg-accent/10 transition-colors cursor-pointer"
    >
      {/* Sun - shown in dark mode */}
      <svg
        className="block in-data-[theme=light]:hidden"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
      {/* Moon - shown in light mode */}
      <svg
        className="hidden in-data-[theme=light]:block"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
