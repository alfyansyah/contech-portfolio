import { CheckCircle2, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar Simple */}
      <nav className="bg-white border-b border-slate-200 p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
                <div className="bg-orange-600 p-1.5 rounded text-white"><Terminal className="w-5 h-5"/></div>
                CONTECH<span className="text-orange-600">LABS</span>
            </Link>
            <Link href="/auth" className="text-sm font-bold text-slate-600 hover:text-orange-600">Login</Link>
        </div>
      </nav>

      <main className="py-20 px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Investasi Kecil, <span className="text-orange-600">Profit Besar</span></h1>
            <p className="text-slate-600 text-lg">Pilih paket yang sesuai dengan skala proyek konstruksi Anda. Hemat waktu administrasi hingga 70%.</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* FREE PLAN */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all">
                <div className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">STARTER</div>
                <div className="text-4xl font-bold text-slate-900 mb-6">Rp 0 <span className="text-sm font-normal text-slate-400">/ selamanya</span></div>
                <p className="text-slate-500 mb-8 text-sm">Cocok untuk mandor atau mahasiswa teknik sipil.</p>
                <Link href="/auth" className="block w-full py-3 border border-slate-300 rounded-xl text-center font-bold hover:bg-slate-50 transition">Daftar Gratis</Link>
                <div className="mt-8 space-y-4">
                    {['Hitung Beton & Dinding', 'Download PDF Sederhana', 'Simpan 3 Proyek'].map(i => (
                        <div key={i} className="flex gap-3 text-sm text-slate-600"><CheckCircle2 className="w-5 h-5 text-green-500"/> {i}</div>
                    ))}
                </div>
            </div>

            {/* PRO PLAN (Highlight) */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-orange-500 shadow-2xl relative transform md:-translate-y-4">
                <div className="absolute top-0 right-0 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">POPULAR</div>
                <div className="text-sm font-bold text-orange-400 mb-2 uppercase tracking-wider">PROFESSIONAL</div>
                <div className="text-4xl font-bold text-white mb-6">Rp 199rb <span className="text-sm font-normal text-slate-400">/ bulan</span></div>
                <p className="text-slate-400 mb-8 text-sm">Untuk kontraktor yang menangani banyak proyek sekaligus.</p>
                <button className="block w-full py-3 bg-orange-600 rounded-xl text-center font-bold text-white hover:bg-orange-700 transition shadow-lg shadow-orange-900/50">Mulai Trial 7 Hari</button>
                <div className="mt-8 space-y-4">
                    {['Semua Fitur Starter', 'Unlimited Simpan Proyek', 'Kop Surat PDF Custom Logo', 'Database AHSP Lengkap', 'Prioritas Support WA'].map(i => (
                        <div key={i} className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-orange-500"/> {i}</div>
                    ))}
                </div>
            </div>

            {/* ENTERPRISE */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all">
                <div className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">ENTERPRISE</div>
                <div className="text-4xl font-bold text-slate-900 mb-6">Custom</div>
                <p className="text-slate-500 mb-8 text-sm">Sistem terintegrasi untuk perusahaan konstruksi besar.</p>
                <a href="https://wa.me/6281234567890" className="block w-full py-3 bg-slate-100 rounded-xl text-center font-bold hover:bg-slate-200 transition text-slate-900">Hubungi Sales</a>
                <div className="mt-8 space-y-4">
                    {['Custom Domain (nama-pt.com)', 'Multi-User Access', 'Integrasi ERP/Keuangan', 'Training Pegawai', 'Dedicated Server'].map(i => (
                        <div key={i} className="flex gap-3 text-sm text-slate-600"><CheckCircle2 className="w-5 h-5 text-blue-500"/> {i}</div>
                    ))}
                </div>
            </div>

        </div>
      </main>
    </div>
  );
}