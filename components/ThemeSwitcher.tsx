"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useTheme } from "next-themes";
import { useEffect, useSyncExternalStore } from "react";
import { cn } from "../lib/utils";
import type { SiteTheme } from "../lib/site-theme";

const options: { value: SiteTheme; label: string; icon: string }[] = [
  { value: "farm-day", label: "Day", icon: "☀" },
  { value: "lullaby-dusk", label: "Dusk", icon: "☾" },
  { value: "storybook-focus", label: "Story", icon: "✦" },
];

export function ThemeSwitcher({ suggestedTheme }: { suggestedTheme: SiteTheme }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);

  useEffect(() => {
    if (!window.localStorage.getItem("theme") && theme !== suggestedTheme) setTheme(suggestedTheme);
  }, [setTheme, suggestedTheme, theme]);

  const value = mounted && siteTheme(theme) ? siteTheme(theme) : suggestedTheme;

  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(next) => next && setTheme(next)}
      aria-label="Choose a visual theme"
      className="theme-switcher inline-flex items-center gap-0.5 rounded-lg border border-white/20 bg-white/10 p-1 text-[10px] font-bold text-white backdrop-blur"
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          aria-label={`${option.label} theme`}
          className={cn(
            "rounded-md px-2 py-1.5 opacity-70 transition hover:bg-white/15 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sunlit)]",
            "data-[state=on]:bg-white data-[state=on]:text-[var(--navy)] data-[state=on]:opacity-100",
          )}
        >
          <span aria-hidden="true" className="mr-1">{option.icon}</span>{option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}

function siteTheme(value: string | undefined): SiteTheme | undefined {
  return options.some((option) => option.value === value) ? value as SiteTheme : undefined;
}
