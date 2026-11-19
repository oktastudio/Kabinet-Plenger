import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kabinet Plenger",
  description: "Game satir meja sidang kabinet & agenda rahasia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#0c0a09",
          overflow: "hidden",
          userSelect: "none",
        }}
      >
        {children}
      </body>
    </html>
  );
}
