"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Terminal, Database, Cpu, ArrowRight, MessageCircle, 
  LayoutDashboard, Bot, Smartphone, CheckCircle2, Building2, UserCircle, Star, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const [tools, setTools] = useState<any[]>([]);

  // Fetch data di client side agar bisa dikombinasikan dengan animasi
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

  // Variabel Animasi (Resep Gerakan)
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      
      {/* 1. NAVBAR (Glassmorphism) */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex items-center gap-2"
          >
            <div className="bg-orange-600 p-2 rounded-xl text-white shadow-lg shadow-orange-600/20">
              <Terminal className="w-6 h-6" />
            </div>
            <div className="leading-tight">
              <h1 className="font-bold text-xl tracking-tight text-slate-900">CONTECH<span className="text-orange-600">LABS</span></h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Digital Construction Solutions</p>
            </div>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {['Layanan', 'Portfolio', 'Keunggulan'].map((item, i) => (
                <motion.a 
                    key={item}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    href={`#${item.toLowerCase()}`} 
                    className="hover:text-orange-600 transition-colors"
                >
                    {item}
                </motion.a>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
             <Link href="/auth" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 text-sm font-bold hover:border-orange-600 hover:text-orange-600 transition-all bg-white">
                <UserCircle className="w-4 h-4" /> Login
            </Link>
            <Link href="/calculator" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/20">
                Coba App <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* 2. HERO SECTION (Dynamic Gradient & Animation) */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-orange-400/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm"
          >
            <Cpu className="w-4 h-4 text-orange-600" /> Revolutionizing Construction Technology
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]"
          >
            Transformasi Digital untuk <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              Kontraktor Masa Depan
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Hentikan kebocoran biaya dan kesalahan data lapangan. 
            Kami membangun <strong>Sistem Manajemen, Aplikasi Custom, & Otomatisasi AI</strong> yang dirancang khusus oleh ahli konstruksi.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link 
              href="/calculator" 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-600 text-white font-bold hover:bg-orange-700 shadow-xl shadow-orange-600/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <Smartphone className="w-5 h-5" />
              Coba Kalkulator Gratis
            </Link>
            <Link 
              href="#portfolio" 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-700 font-bold hover:bg-slate-50 border border-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <Database className="w-5 h-5 text-slate-400" /> Lihat Produk
            </Link>
          </motion.div>

          {/* Social Proof / Trust Badge */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 pt-8 border-t border-slate-200 flex flex-wrap justify-center gap-8 text-slate-400 grayscale opacity-70"
          >
             {/* Logo Client Placeholder */}
             <div className="flex items-center gap-2 font-bold text-lg"><Building2/> PT. Waskita Karya (Persero)</div>
             <div className="flex items-center gap-2 font-bold text-lg"><Building2/> PT. Adhi Karya</div>
             <div className="flex items-center gap-2 font-bold text-lg"><Building2/> Dinas PUPR</div>
          </motion.div>
        </div>
      </section>

      {/* 3. SERVICES SECTION (Hover Cards) */}
      <section id="services" className="py-24 px-4 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Solusi End-to-End</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Sistem yang menyelesaikan masalah operasional Anda.</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
                { icon: LayoutDashboard, color: 'blue', title: 'Custom Web Apps', desc: 'Dashboard Manajemen Proyek & HRIS khusus konstruksi.' },
                { icon: Smartphone, color: 'orange', title: 'Mobile Field Tools', desc: 'Aplikasi Mandor untuk laporan harian & opname material.' },
                { icon: Bot, color: 'purple', title: 'AI & Automation', desc: 'Estimasi RAB otomatis & Chatbot teknis.' }
            ].map((srv, i) => (
                <motion.div 
                    key={i}
                    variants={fadeInUp}
                    whileHover={{ y: -10 }}
                    className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all group"
                >
                    <div className={`w-14 h-14 bg-${srv.color}-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <srv.icon className={`w-7 h-7 text-${srv.color}-600`} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">{srv.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">{srv.desc}</p>
                </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. PORTFOLIO SECTION (Dynamic Data) */}
      <section id="portfolio" className="py-24 px-4 bg-slate-50">
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
            {tools.map((tool, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                key={tool.id} 
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-200 transition-all flex flex-col h-full"
              >
                <div className="p-8 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                      <Terminal className="w-6 h-6 text-slate-700" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                       tool.status === 'Live' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {tool.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{tool.name}</h3>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-2">{tool.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                    {tool.tech_stack ? tool.tech_stack.split(',').map((tech: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-mono text-slate-500 font-bold">
                        {tech.trim()}
                      </span>
                    )) : null}
                  </div>

                  {tool.demo_url ? (
                    <Link href={tool.demo_url} target="_blank" className="w-full flex items-center justify-center py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-orange-600 transition-colors mt-auto shadow-lg hover:shadow-orange-500/25">
                      Coba Demo Live
                    </Link>
                  ) : (
                    <button disabled className="w-full py-3 rounded-xl bg-slate-100 text-slate-400 text-sm font-bold cursor-not-allowed mt-auto">
                      Dalam Pengembangan
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY US / CTA */}
      <section id="why-us" className="py-24 px-4 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-600 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Dibangun oleh <br/> <span className="text-orange-500">Ahli Konstruksi.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Software House biasa tidak paham bedanya <em>Opname</em> dan <em>Progress Fisik</em>. 
              Kami paham. ConTech Labs didirikan oleh praktisi lapangan.
            </p>
            
            <div className="space-y-4">
              {['Paham Alur Proyek & Logistik', 'Desain Simpel untuk Orang Lapangan', 'Output PDF Resmi Siap Cetak'].map((txt, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <span className="font-medium">{txt}</span>
                  </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm"
          >
             <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                <div className="p-3 bg-orange-600 rounded-full"><ShieldCheck className="w-6 h-6 text-white" /></div>
                <div>
                  <div className="font-bold text-lg">Konsultasi Transformasi</div>
                  <div className="text-xs text-slate-400">Gratis Sesi Diskusi 30 Menit</div>
                </div>
             </div>
             <p className="text-slate-400 text-sm mb-6">
               Ceritakan masalah manual Anda (laporan telat, stok hilang, RAB bocor), kami akan sketsakan solusinya.
             </p>
             <a 
               href="https://wa.me/6281234567890" 
               target="_blank"
               className="w-full block text-center bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-orange-600/40"
             >
               <MessageCircle className="w-5 h-5 inline-block mr-2" />
               Chat WhatsApp Founder
             </a>
          </motion.div>
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
              <li><a href="https://wa.me/6281234567890" className="hover:text-orange-600">+62 812-3456-7890</a></li>
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