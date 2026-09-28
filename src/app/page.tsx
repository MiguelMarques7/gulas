import React from 'react';
import Link from 'next/link';
import {
  QrCode,
  Utensils,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141619] flex flex-col selection:bg-[#15803D] selection:text-white">
      {/* Navigation */}
      <header className="border-b border-zinc-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-black text-xl tracking-tight text-[#141619] uppercase leading-none">
              GULAS
            </span>
            <span className="text-xs font-semibold text-[#15803D] hidden sm:inline-block">
              Pizza · Burger · Coffee
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/menu/gulas"
              className="px-3.5 py-1.5 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <span>Abrir Menu</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 sm:py-16 flex flex-col items-center text-center">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#15803D] text-xs font-bold mb-6">
          <span>Vila das Aves, Portugal</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#141619] max-w-2xl leading-[1.12]">
          Menu digital oficial do <span className="text-[#15803D]">Gulas</span>
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-zinc-600 max-w-md font-normal leading-relaxed">
          Caracóizzz, burgers artesanais em pão brioche, panuozzos e pizzas em Vila das Aves.
        </p>

        {/* Demo Action Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg text-left">
          {/* Menu Normal */}
          <Link
            href="/menu/gulas"
            className="group p-4 rounded-xl bg-white border border-zinc-200/90 hover:border-[#15803D] transition-all duration-200 hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#15803D] flex items-center justify-center mb-2.5">
                <Utensils className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-[#141619] group-hover:text-[#15803D] transition-colors">
                Menu Geral
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Consulta o menu e escolhe a tua mesa livremente.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-[#15803D]">
              <span>Ver Menu</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* QR Code Table Direct Access */}
          <Link
            href="/menu/gulas/table/4"
            className="group p-4 rounded-xl bg-white border border-zinc-200/90 hover:border-[#15803D] transition-all duration-200 hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#15803D] text-white flex items-center justify-center mb-2.5">
                <QrCode className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-[#141619] group-hover:text-[#15803D] transition-colors">
                Simular QR Code — Mesa 4
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Experiência de cliente com mesa bloqueada por leitura de QR.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-[#15803D]">
              <span>Testar Mesa 4</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 py-4 text-center text-xs text-zinc-500 bg-white">
        <p>GULAS — Pizza, Burger & Coffee · Vila das Aves, Portugal</p>
      </footer>
    </div>
  );
}
