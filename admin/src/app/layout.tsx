import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClientProvider } from '@/lib/react-query-provider';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';

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
        <ErrorBoundary>
          <QueryClientProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
