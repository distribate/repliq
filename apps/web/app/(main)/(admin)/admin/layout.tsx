import { ReactNode } from 'react';
import { validateRequest } from '@repo/lib/utils/auth/validate-requests.ts';
import { permanentRedirect } from 'next/navigation';
import { checkAdminPermission } from '@repo/lib/actions/check-admin-permission.ts';
import { AdminNavigation } from '@repo/components/src/admin/components/navigation/admin-navigation.tsx';
import { Metadata } from 'next';

type AdminLayoutProps = {
  tickets: ReactNode,
  children: ReactNode,
  reports: ReactNode,
  configs: ReactNode
  stats: ReactNode
}

export const metadata: Metadata = {
  title: 'Админ-панель',
};

export default async function AdminLayout({
  tickets, children, reports, configs, stats,
}: AdminLayoutProps) {
  const { user, session } = await validateRequest();
  
  if (!user || !session) {
    return permanentRedirect('/');
  }
  
  const isAdmin = await checkAdminPermission();
  
  if (!isAdmin) {
    return permanentRedirect('/');
  }
  
  return (
    <div className="flex flex-col bg-shark-950 gap-6 p-2 rounded-[12px] w-full h-full">
      <AdminNavigation />
      {configs}
      {tickets}
      {reports}
      {stats}
      {children}
    </div>
  );
}