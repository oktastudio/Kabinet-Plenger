import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kabinet Plenger — Simulasi Pemerintahan & APBN",
  description:
    "Simulasi menjadi Presiden dan Menteri dalam dinamika politik dan anggaran Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
