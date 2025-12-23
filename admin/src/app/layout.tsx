import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClientProvider } from '@/lib/react-query-provider';

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <QueryClientProvider>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
