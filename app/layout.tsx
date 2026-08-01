import type { Metadata } from "next";
import { ThemeProvider } from "../components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teacher Resources | Old MacDonald Had a School",
  description:
    "Curriculum-organized Grade 1/2 lesson starting points with clear teaching sequences, curated resources, and targeted searches.",
  icons: {
    icon: "/brand-emblem.png",
    shortcut: "/brand-emblem.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
