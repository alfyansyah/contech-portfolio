import { supabase } from '@/lib/supabase';
import { 
  Terminal, Database, Cpu, ArrowRight, MessageCircle, 
  LayoutDashboard, Bot, Smartphone, CheckCircle2, Building2, UserCircle 
} from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
export const revalidate = 0;

async function getTools() {
  const { data, error } = await supabase
    .from('saas_tools')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error mengambil data:', error);
    return [];
  }
  return data || [];
}

export default async function Home() {
  const tools = await getTools();

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      
      {/* 1. NAVBAR UPDATE: Ada tombol Login */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-600 p-2 rounded-lg text-white">
              <Terminal className="w-6 h-6" />
            </div>
            <div className="leading-tight">
              <h1 className="font-bold text-xl tracking-tight text-slate-900">CONTECH<span className="text-orange-600">LABS</span></h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Digital Construction Solutions</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#services" className="hover:text-orange-600 transition-colors">Layanan</a>
            <a href="#portfolio" className="hover:text-orange-600 transition-colors">Portfolio</a>
            <a href="#why-us" className="hover:text-orange-600 transition-colors">Keunggulan</a>
          </div>

          <div className="flex items-center gap-3">
             {/* Tombol Login Baru */}
             <Link 
              href="/auth" 
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-sm font-bold hover:border-orange-600 hover:text-orange-600 transition-all"
            >
              <UserCircle className="w-4 h-4" /> Login
            </Link>
            
            <a 
                href="https://wa.me/6282280307626" 
                target="_blank"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all"
            >
                Hubungi Kami
            </a>
          </div>

        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider mb-8 border border-orange-100">
            <Cpu className="w-4 h-4" /> Revolutionizing Construction
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Transformasi Digital untuk <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              Kontraktor Masa Depan
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Hentikan kebocoran biaya dan kesalahan data lapangan. 
            Kami membangun <strong>Sistem Manajemen, Aplikasi Custom, & Otomatisasi AI</strong> yang dirancang khusus oleh ahli konstruksi untuk ahli konstruksi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/calculator" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 shadow-xl shadow-orange-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <Smartphone className="w-5 h-5" />
              Coba Kalkulator Gratis
            </Link>
            <Link 
              href="#portfolio" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-slate-700 font-bold hover:bg-slate-50 border border-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <Database className="w-5 h-5 text-slate-400" /> Lihat Produk
            </Link>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section id="services" className="py-24 px-4 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Solusi End-to-End</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Kami tidak sekadar membuat website. Kami membuat sistem yang menyelesaikan masalah operasional Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <LayoutDashboard className="w-7 h-7 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Custom Web Apps</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Pembuatan Dashboard Manajemen Proyek, Sistem Logistik Gudang, hingga HRIS khusus konstruksi. Data real-time dari lapangan ke kantor.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
                <Smartphone className="w-7 h-7 text-orange-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Mobile Field Tools</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Aplikasi ringan untuk Mandor & Pelaksana. Laporan harian, opname material, dan request alat berat langsung dari HP tanpa instalasi rumit.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                <Bot className="w-7 h-7 text-purple-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI & Automation</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Otomatisasi rekap Excel, Chatbot tanya-jawab spek teknis, dan hitung estimasi RAB otomatis menggunakan teknologi AI terbaru.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PORTFOLIO SECTION */}
      <section id="portfolio" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Products</h2>
              <p className="text-slate-500">Aplikasi yang telah kami kembangkan.</p>
            </div>
            <Link href="#" className="hidden md:flex items-center text-orange-600 font-bold hover:underline">
              Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool: any) => (
              <div key={tool.id} className="group bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all flex flex-col h-full">
                <div className="p-8 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                      <Terminal className="w-6 h-6 text-slate-700" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                       tool.status === 'Live' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {tool.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{tool.name}</h3>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-2">{tool.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                    {tool.tech_stack ? tool.tech_stack.split(',').map((tech: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-500">
                        {tech.trim()}
                      </span>
                    )) : null}
                  </div>

                  {tool.demo_url ? (
                    <Link href={tool.demo_url} target="_blank" className="w-full flex items-center justify-center py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-orange-600 transition-colors mt-auto">
                      Coba Demo Live
                    </Link>
                  ) : (
                    <button disabled className="w-full py-3 rounded-xl bg-slate-200 text-slate-400 text-sm font-bold cursor-not-allowed mt-auto">
                      Dalam Pengembangan
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {tools.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                Belum ada data aplikasi.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. WHY US SECTION */}
      <section id="why-us" className="py-24 px-4 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-600 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Dibangun oleh <br/> <span className="text-orange-500">Ahli Konstruksi.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Software House biasa tidak paham bedanya <em>Opname</em> dan <em>Progress Fisik</em>. 
              Kami paham. Karena ConTech Labs didirikan oleh praktisi lapangan yang beralih menjadi ahli teknologi.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span className="font-medium">Paham Alur Proyek & Logistik</span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span className="font-medium">Desain Simpel untuk Orang Lapangan</span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span className="font-medium">Integrasi WhatsApp & Excel (No-Code)</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
             <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
                <Building2 className="w-10 h-10 text-orange-500" />
                <div>
                  <div className="font-bold text-lg">Konsultasi Transformasi</div>
                  <div className="text-xs text-slate-400">Gratis Sesi Diskusi 30 Menit</div>
                </div>
             </div>
             <p className="text-slate-400 text-sm mb-6">
               Ceritakan masalah manual Anda (laporan telat, stok hilang, RAB bocor), kami akan sketsakan solusinya saat itu juga.
             </p>
             <a 
               href="https://wa.me/6281234567890" 
               target="_blank"
               className="w-full block text-center bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-colors"
             >
               Jadwalkan Diskusi
             </a>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-orange-600 p-1.5 rounded text-white">
                 <Terminal className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-slate-900">CONTECH<span className="text-orange-600">LABS</span></span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm">
              Partner teknologi terpercaya untuk kontraktor modern. Mengubah kerumitan konstruksi menjadi efisiensi digital.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-orange-600">Web App Development</a></li>
              <li><a href="#" className="hover:text-orange-600">Sistem Inventory</a></li>
              <li><a href="#" className="hover:text-orange-600">AI Estimation Tools</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Kontak</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>Jakarta, Indonesia</li>
              <li><a href="mailto:hello@contechlabs.id" className="hover:text-orange-600">hello@contechlabs.id</a></li>
              <li><a href="https://wa.me/6282280307626" className="hover:text-orange-600">+62 812-3456-7626</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <p>© 2024 ConTech Labs. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  );
}