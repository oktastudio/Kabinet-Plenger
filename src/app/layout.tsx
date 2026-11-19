import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kabinet Plenger — Simulasi Sidang & Agenda Rahasia",
  description:
    "Game simulasi kabinet Indonesia: kelola APBN, deteksi menteri titipan, dan bertahan 5 tahun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#141210" }}>
        {children}
      </body>
    </html>
  );
}
