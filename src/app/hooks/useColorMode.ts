"use client";

import { useEffect, useState } from "react";

export function useColorMode(): "light" | "dark" {
  const [colorMode, setColorMode] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = document.documentElement;

    function readTheme() {
      const theme = root.getAttribute("data-theme");
      setColorMode(theme === "light" ? "light" : "dark");
    }

    readTheme();

    const observer = new MutationObserver(readTheme);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return colorMode;
}
