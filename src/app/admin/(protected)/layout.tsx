import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedStaff } from '@/lib/auth/staff';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const staff = await getAuthenticatedStaff();

  // Strict server-side access control
  if (!staff) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen flex flex-col bg-gulas-cream">
      <AdminHeader staff={staff} />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
