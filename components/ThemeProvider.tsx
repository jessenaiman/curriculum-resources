"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="farm-day"
      enableSystem={false}
      themes={["farm-day", "lullaby-dusk", "storybook-focus"]}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
