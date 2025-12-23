import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Şehitkamil Belediyesi - Admin Panel",
  description: "Şehitkamil Belediyesi Süper Uygulama Admin Paneli",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}

