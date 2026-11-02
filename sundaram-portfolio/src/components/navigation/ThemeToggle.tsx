"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { getServerTheme, getTheme, subscribeTheme, toggleTheme } from "@/lib/theme";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button type="button" className="icon-btn" onClick={toggleTheme} aria-label={`Switch to ${next} theme`}>
      {theme === "dark" ? <Sun className="size-[18px]" aria-hidden="true" /> : <Moon className="size-[18px]" aria-hidden="true" />}
    </button>
  );
}
