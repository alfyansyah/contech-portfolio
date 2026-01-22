import { supabase } from '@/lib/supabase';
import { Terminal, Database, Cpu, ArrowRight } from 'lucide-react';

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
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* 1. NAVBAR SEDERHANA */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
            <Terminal className="w-6 h-6 text-orange-600" />
            <span>CONTECH<span className="text-slate-400">LABS</span></span>
          </div>
          <div className="text-sm font-medium text-slate-500">
            Digital Transformation Specialist
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (Intro) */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Cpu className="w-4 h-4" /> Construction Tech Specialist
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Membangun Solusi Digital untuk <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              Industri Konstruksi
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Saya membantu perusahaan konstruksi beralih dari manual ke digital. 
            Menciptakan sistem SaaS, Otomatisasi, dan AI yang presisi.
          </p>
        </div>
      </section>

      {/* 3. PORTFOLIO / TOOLS SECTION (Data dari Supabase) */}
      <section className="py-16 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Database className="w-5 h-5 text-orange-600" />
            <h2 className="text-2xl font-bold text-slate-900">Featured SaaS & Tools</h2>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Looping Data dari Supabase */}
            {tools.map((tool) => (
              <div key={tool.id} className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                    tool.status === 'Live' ? 'bg-green-100 text-green-700' : 
                    tool.status === 'Beta' ? 'bg-blue-100 text-blue-700' : 
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {tool.status}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">{tool.name}</h3>
                <p className="text-slate-600 text-sm mb-4 flex-grow">
                  {tool.description}
                </p>

                <div className="pt-4 border-t border-slate-100 mt-auto">
                  <div className="text-xs text-slate-400 font-mono mb-3">
                    Stack: {tool.tech_stack}
                  </div>
                  {tool.demo_url ? (
                    <a href={tool.demo_url} target="_blank" className="inline-flex items-center text-sm font-semibold text-orange-600 hover:text-orange-700">
                      View Demo <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400 cursor-not-allowed">Demo Coming Soon</span>
                  )}
                </div>
              </div>
            ))}

            {/* Jika Data Kosong */}
            {tools.length === 0 && (
              <div className="col-span-full text-center py-10 text-slate-400">
                Belum ada data tools yang ditemukan. Cek koneksi Supabase Anda.
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200 bg-white">
        © {new Date().getFullYear()} ConTech Labs by Alfyansyah. Built with Next.js & Supabase.
      </footer>
    </main>
  );
}