import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Long & Short Vowels | Old MacDonald Had a School",
  description:
    "A practical Grade 1/2 lesson workspace with a four-step teaching sequence and curated starting resources.",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
