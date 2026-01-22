import { supabase } from '@/lib/supabase';
import { Terminal, Database, Cpu, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';

// Fungsi khusus untuk mengambil data dari Supabase (Server Side)
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
  // Panggil fungsi ambil data
  const tools = await getTools();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans scroll-smooth">
      
      {/* 1. NAVBAR SEDERHANA */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
            <Terminal className="w-6 h-6 text-orange-600" />
            <span>CONTECH<span className="text-slate-400">LABS</span></span>
          </div>
          <div className="text-sm font-medium text-slate-500 hidden sm:block">
            Digital Transformation Specialist
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (Intro) */}
      <section className="py-20 px-4 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Cpu className="w-4 h-4" /> Construction Tech Specialist
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Membangun Solusi Digital untuk <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              Industri Konstruksi
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Saya membantu perusahaan konstruksi beralih dari manual ke digital. 
            Menciptakan sistem SaaS, Otomatisasi, dan AI yang presisi.
          </p>

          {/* TOMBOL ACTION (BARU) */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* GANTI NOMOR WA DI SINI (Format: 628...) */}
            <a 
              href="https://wa.me/6282280307626?text=Halo,%20saya%20tertarik%20diskusi%20tentang%20pembuatan%20Web%20App%20Konstruksi" 
              target="_blank"
              className="px-8 py-4 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 shadow-xl shadow-orange-200 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <MessageCircle className="w-5 h-5" />
              Konsultasi Gratis
            </a>
            
            <Link 
              href="#portfolio" 
              className="px-8 py-4 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 border border-slate-200 transition-colors w-full sm:w-auto text-center"
            >
              Lihat Karya
            </Link>
          </div>
        </div>
      </section>

      {/* 3. PORTFOLIO / TOOLS SECTION (Data dari Supabase) */}
      <section id="portfolio" className="py-20 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-10">
            <Database className="w-6 h-6 text-orange-600" />
            <h2 className="text-3xl font-bold text-slate-900">Featured SaaS & Tools</h2>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Looping Data dari Supabase */}
            {tools.map((tool) => (
              <div key={tool.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all p-6 flex flex-col h-full">
                
                <div className="flex justify-between items-start mb-4">
                  <div className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                    tool.status === 'Live' ? 'bg-green-100 text-green-700' : 
                    tool.status === 'Beta' ? 'bg-blue-100 text-blue-700' : 
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {tool.status}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {tool.name}
                </h3>
                
                <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">
                  {tool.description}
                </p>

                <div className="pt-5 border-t border-slate-100 mt-auto">
                  <div className="text-xs text-slate-400 font-mono mb-4 bg-slate-50 p-2 rounded">
                    Stack: {tool.tech_stack}
                  </div>
                  
                  {tool.demo_url ? (
                    <Link href={tool.demo_url} className="w-full inline-flex items-center justify-center py-2.5 rounded-lg text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors">
                      View Demo <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  ) : (
                    <button disabled className="w-full py-2.5 rounded-lg text-sm font-medium text-slate-400 bg-slate-100 cursor-not-allowed">
                      Demo Coming Soon
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Jika Data Kosong */}
            {tools.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
                <Database className="w-10 h-10 mb-4 opacity-20" />
                <p>Belum ada data tools yang ditemukan.</p>
                <p className="text-xs mt-2">Cek koneksi Supabase Anda di .env</p>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="py-10 text-center text-slate-400 text-sm border-t border-slate-200 bg-white">
        <p>© {new Date().getFullYear()} ConTech Labs. Built with precision.</p>
      </footer>
    </main>
  );
}