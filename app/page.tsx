"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Terminal, ArrowRight, LayoutDashboard, Smartphone, 
  Bot, ChevronRight, Zap, Code2, Layers
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const [tools, setTools] = useState<any[]>([]);

  useEffect(() => {
    const fetchTools = async () => {
      const { data } = await supabase
        .from('saas_tools')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setTools(data);
    };
    fetchTools();
  }, []);

  return (
    <main className="min-h-screen bg-[#0B0C10] text-slate-300 font-sans selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden relative">
      
      {/* --- BACKGROUND AREA --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        
        {/* 1. Grid Pattern (Tetap Ada) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* 2. LOGO RAKSASA (ANIMASI) */}
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
                opacity: 0.03, // Sangat transparan (3%) agar elegan
                scale: [1, 1.1, 1], // Efek Bernafas
                rotate: 360 // Berputar pelan
            }}
            transition={{ 
                opacity: { duration: 1 },
                scale: { duration: 10, repeat: Infinity, repeatType: "reverse" }, // Bernafas tiap 10 detik
                rotate: { duration: 120, repeat: Infinity, ease: "linear" } // 1 putaran penuh 2 menit (Sangat pelan)
            }}
            className="absolute w-[800px] h-[800px] opacity-[0.03] blur-sm"
        >
            {/* GANTI LINK INI DENGAN LINK LOGO SUPABASE ANDA */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
                src="https://wsubscnhhabhtubdorhd.supabase.co/storage/v1/object/public/logos/logo-contech.png" 
                alt="ConTech Background" 
                className="w-full h-full object-contain grayscale"
            />
        </motion.div>

        {/* 3. Cahaya Glow Tengah */}
        <div className="absolute h-[310px] w-[310px] rounded-full bg-orange-500 opacity-20 blur-[120px]"></div>
      </div>

      {/* 1. NAVBAR */}
      <nav className="fixed w-full top-6 z-50 px-4">
        <div className="max-w-5xl mx-auto bg-[#15161A]/80 backdrop-blur-md border border-white/10 rounded-full px-6 h-16 flex items-center justify-between shadow-2xl shadow-black/50">
          <div className="flex items-center gap-3">
            {/* Logo Kecil di Navbar */}
            <img 
                src="https://wsubscnhhabhtubdorhd.supabase.co/storage/v1/object/public/logos/logo-contech.png" 
                alt="Logo" className="w-8 h-8 object-contain" 
            />
            <span className="font-bold text-white tracking-tight">CONTECH<span className="text-orange-500">LABS</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {['Services', 'Products', 'Vision'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
             <Link href="/auth" className="text-xs font-bold hover:text-white transition-colors">LOGIN</Link>
             <Link href="/calculator" className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold hover:bg-slate-200 transition-all flex items-center gap-2">
                TRY DEMO <ArrowRight className="w-3 h-3" />
             </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-48 pb-32 px-4 z-10">
        <div className="max-w-6xl mx-auto text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-[10px] font-mono mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            SYSTEM ONLINE V2.0
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-extrabold text-white tracking-tighter mb-8 leading-[0.9]"
          >
            WE BUILD THE <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-500">
              DIGITAL BACKBONE
            </span> <br/>
            OF CONSTRUCTION.
          </motion.h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Lupakan Excel manual. Kami mengubah data lapangan menjadi kode, 
            dan kode menjadi efisiensi profit. <span className="text-white font-medium">SaaS. AI. Automation.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/calculator" 
              className="group relative px-8 py-4 bg-orange-600 text-white font-bold rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="flex items-center gap-2">LAUNCH APP <Zap className="w-4 h-4 fill-white" /></span>
            </Link>
            <Link 
              href="#products" 
              className="px-8 py-4 border border-white/10 rounded-xl text-white font-bold hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              VIEW BLUEPRINTS
            </Link>
          </div>

          {/* 3D DASHBOARD PREVIEW */}
          <motion.div 
            initial={{ opacity: 0, y: 50, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16 mx-auto max-w-5xl perspective-1000"
          >
            <div className="relative rounded-xl border border-white/10 bg-[#15161A] shadow-2xl shadow-orange-500/10 overflow-hidden transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out p-2">
                <div className="h-8 bg-black/50 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 text-[10px] text-slate-500 bg-black/50 px-2 py-0.5 rounded text-center flex-1 font-mono">dashboard.contech.id</div>
                </div>
                
                {/* Placeholder Screenshot Dashboard */}
                <div className="aspect-video bg-slate-900 relative flex items-center justify-center border-t border-white/5">
                    <div className="text-slate-600 font-mono text-sm text-center">
                        [ <LayoutDashboard className="inline w-4 h-4 mb-1"/> DASHBOARD PREVIEW ]<br/>
                        <span className="text-xs opacity-50">Upload screenshot here via Supabase</span>
                    </div>
                    {/* Efek Kilau */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                </div>
            </div>
            
            <div className="absolute -bottom-10 left-0 right-0 h-40 bg-orange-600/20 blur-[100px] -z-10 rounded-full"></div>
          </motion.div>

        </div>
      </section>

      {/* 3. BENTO GRID SERVICES */}
      <section id="services" className="py-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
            <div className="mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">ENGINEERED FOR <span className="text-slate-600">IMPACT.</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Large Card */}
                <div className="md:col-span-2 bg-[#15161A] border border-white/5 p-8 rounded-3xl hover:border-orange-500/30 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-orange-600/10 rounded-full blur-[80px] group-hover:bg-orange-600/20 transition-all"></div>
                    <LayoutDashboard className="w-10 h-10 text-white mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-2">Custom SaaS Development</h3>
                    <p className="text-slate-400 max-w-md">Kami membangun Sistem Operasi lengkap untuk perusahaan Anda. Dari Logistik, HRIS, hingga Keuangan Proyek, semua dalam satu dashboard terintegrasi.</p>
                </div>

                {/* Tall Card */}
                <div className="bg-[#15161A] border border-white/5 p-8 rounded-3xl hover:border-blue-500/30 transition-all group">
                    <Smartphone className="w-10 h-10 text-blue-500 mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">Mobile Field Ops</h3>
                    <p className="text-slate-400 text-sm">Aplikasi ringan untuk Mandor. Input data tanpa sinyal (Offline Mode).</p>
                </div>

                {/* Wide Card */}
                <div className="md:col-span-3 bg-[#15161A] border border-white/5 p-8 rounded-3xl hover:border-purple-500/30 transition-all flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <Bot className="w-8 h-8 text-purple-500" />
                            <h3 className="text-xl font-bold text-white">AI Automation Integration</h3>
                        </div>
                        <p className="text-slate-400">Jangan biarkan admin Anda copy-paste Excel seharian. Kami membuat bot AI yang membaca PDF, input data otomatis, dan mengirim laporan via WhatsApp.</p>
                    </div>
                    {/* Visual Code */}
                    <div className="flex-1 w-full bg-black/30 rounded-xl p-4 border border-white/5 font-mono text-xs text-green-400">
                        &gt; Processing invoice... OK<br/>
                        &gt; Updating inventory... OK<br/>
                        &gt; Sending report to Owner... SENT.
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 4. PRODUCTS SHOWCASE */}
      <section id="products" className="py-32 px-4 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
                <h2 className="text-4xl font-bold text-white">DEPLOYED <span className="text-orange-600">SYSTEMS</span></h2>
                <Link href="/calculator" className="text-sm font-mono text-slate-400 hover:text-white flex items-center gap-2">VIEW ALL <ChevronRight className="w-4 h-4"/></Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tools.map((tool, i) => (
                    <div key={tool.id} className="group bg-[#15161A] border border-white/5 rounded-2xl overflow-hidden hover:translate-y-[-5px] transition-all duration-300">
                        <div className="h-48 bg-slate-800/50 flex items-center justify-center border-b border-white/5 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Layers className="w-12 h-12 text-slate-600 group-hover:text-orange-500 transition-colors" />
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-mono text-orange-500 bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20">{tool.status}</span>
                                <Code2 className="w-4 h-4 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
                            <p className="text-sm text-slate-400 mb-6 line-clamp-2">{tool.description}</p>
                            
                            {tool.demo_url ? (
                                <Link href={tool.demo_url} className="block w-full py-3 bg-white text-black text-center font-bold text-sm rounded-lg hover:bg-slate-200 transition-colors">
                                    LIVE DEMO
                                </Link>
                            ) : (
                                <button disabled className="block w-full py-3 bg-slate-800 text-slate-500 text-center font-bold text-sm rounded-lg cursor-not-allowed">
                                    DEV MODE
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="border-t border-white/5 py-12 px-4 bg-black relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <img 
                    src="https://wsubscnhhabhtubdorhd.supabase.co/storage/v1/object/public/logos/logo-contech.png" 
                    alt="Logo" className="w-6 h-6 object-contain grayscale opacity-50" 
                />
                <span className="font-bold text-slate-500 tracking-widest">CONTECH LABS</span>
            </div>
            <div className="text-slate-600 text-sm">
                &copy; 2024 Digital Construction Infrastructure.
            </div>
            <div className="flex gap-6 text-slate-500 text-sm">
                <a href="#" className="hover:text-white transition-colors">GitHub</a>
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
        </div>
      </footer>

    </main>
  );
}