import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "留言墙 - Note Wall",
  description: "一个轻量级的在线留言墙，留下你的想法，与大家分享",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="gradient-bg antialiased">{children}</body>
    </html>
  );
}
