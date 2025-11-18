import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI営業通話アシスタント",
  description: "電話営業スクリプトをAIで最適化・ログ管理",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <header className="bg-blue-600 text-white p-4">
          <nav className="container mx-auto flex gap-6">
            <a href="/" className="font-bold text-xl">AI営業通話アシスタント</a>
            <a href="/scripts" className="hover:underline">スクリプト管理</a>
            <a href="/calls/new" className="hover:underline">通話ログ登録</a>
          </nav>
        </header>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
