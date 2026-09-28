import React from 'react';

export const metadata = {
  title: 'Gulas Admin — Painel de Gestão',
  description: 'Área de administração e gestão de pedidos do restaurante Gulas.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gulas-cream text-gulas-dark flex flex-col">
      {children}
    </div>
  );
}
