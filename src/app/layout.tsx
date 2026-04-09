import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "留言墙 - Note Wall",
  description: "一个轻量级的在线留言墙",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
