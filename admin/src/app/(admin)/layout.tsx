import MainLayout from '@/components/Layout/MainLayout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}

