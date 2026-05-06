import type { Metadata } from "next";
import "./globals.css";
import CursorTrail from "@/components/CursorTrail";

export const metadata: Metadata = {
  title: "LIHUANKAI — 设计作品集",
  description: "Design is not just what it looks like and feels like. Design is how it works.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">
        <CursorTrail />
        {children}
      </body>
    </html>
  );
}
