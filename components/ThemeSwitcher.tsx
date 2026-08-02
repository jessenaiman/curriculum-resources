"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const THEMES = [
  { value: "farm-day", label: "Farm day", short: "Day" },
  { value: "lullaby-dusk", label: "Lullaby dusk", short: "Dusk" },
  { value: "storybook-focus", label: "Storybook focus", short: "Story" },
] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const activeTheme = mounted && THEMES.some((item) => item.value === theme) ? theme : "farm-day";

  return (
    <ToggleGroup.Root
      className="theme-switcher"
      type="single"
      value={activeTheme}
      onValueChange={(value) => value && setTheme(value)}
      aria-label="Choose the site theme"
    >
      {THEMES.map((item) => (
        <ToggleGroup.Item key={item.value} className="theme-switcher-item" value={item.value} aria-label={item.label}>
          {item.short}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
