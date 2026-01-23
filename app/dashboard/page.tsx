"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Terminal, LogOut, FileText, Plus, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [projects, setProjects] = useState<any[]>([]);

  // 1. Cek User & Ambil Data saat halaman dibuka
  useEffect(() => {
    const getData = async () => {
      // Cek apakah user login?
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth'); // Kalau belum login, tendang ke halaman login
        return;
      }
      
      setUserEmail(user.email || 'User');

      // Ambil data RAB milik user ini
      const { data, error } = await supabase
        .from('saved_rabs')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setProjects(data);
      setLoading(false);
    };

    getData();
  }, [router]);

  // 2. Fungsi Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // 3. Fungsi Hapus Data
  const handleDelete = async (id: number) => {
    if(!confirm("Yakin hapus data ini?")) return;
    
    const { error } = await supabase.from('saved_rabs').delete().eq('id', id);
    if (!error) {
      // Update tampilan (hapus dari list tanpa reload)
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">Memuat Data Proyek...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Navbar Dashboard */}
      <nav className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-orange-600 p-1.5 rounded text-white">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 hidden sm:block">CONTECH<span className="text-orange-600">DASHBOARD</span></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:block">{userEmail}</span>
            <button 
              onClick={handleLogout}
              className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="max-w-6xl mx-auto p-4 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Proyek Saya</h1>
            <p className="text-slate-500 text-sm">Kelola semua perhitungan RAB Anda di sini.</p>
          </div>
          <Link 
            href="/calculator" 
            className="bg-slate-900 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" /> Buat Hitungan Baru
          </Link>
        </div>

        {/* List Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Loop Data Proyek */}
          {projects.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="text-slate-300 hover:text-red-500 p-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="font-bold text-lg text-slate-900 mb-1">{item.project_name}</h3>
              <p className="text-xs text-slate-400 mb-4">
                Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID')}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Volume</span>
                  <span className="font-bold">{item.volume} m³</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total RAB</span>
                  <span className="font-bold text-orange-600">Rp {item.total_cost?.toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <button className="w-full py-2 bg-slate-50 text-slate-600 text-sm font-bold rounded-lg border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                Lihat Detail
              </button>
            </div>
          ))}

          {/* Empty State (Jika belum ada data) */}
          {projects.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-bold">Belum ada proyek</h3>
              <p className="text-slate-500 text-sm mb-6">Mulai hitung estimasi material pertama Anda.</p>
              <Link href="/calculator" className="text-orange-600 font-bold hover:underline">
                Ke Kalkulator &rarr;
              </Link>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}