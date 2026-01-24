"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Terminal, LogOut, FileText, Plus, Search, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth'); 
        return;
      }
      
      setUserEmail(user.email || 'User');

      const { data, error } = await supabase
        .from('saved_rabs')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setProjects(data);
      setLoading(false);
    };

    getData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Yakin hapus data ini?")) return;
    const { error } = await supabase.from('saved_rabs').delete().eq('id', id);
    if (!error) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">Memuat Data...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
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
            <button onClick={handleLogout} className="text-xs font-bold text-red-600 px-3 py-2 rounded border border-red-100 hover:bg-red-50">Logout</button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Proyek Saya</h1>
          <Link href="/calculator" className="bg-slate-900 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg">
            <Plus className="w-4 h-4" /> Hitung Baru
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <button onClick={() => handleDelete(item.id)} className="text-slate-300 hover:text-red-500 p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="font-bold text-lg text-slate-900 mb-1">{item.project_name}</h3>
              <p className="text-xs text-slate-400 mb-4">{new Date(item.created_at).toLocaleDateString('id-ID')}</p>

              <div className="flex justify-between text-sm mb-4 border-t border-slate-100 pt-2">
                  <span className="text-slate-500">Total RAB</span>
                  <span className="font-bold text-orange-600">Rp {item.total_cost?.toLocaleString('id-ID')}</span>
              </div>
              
              {/* PERBAIKAN DI SINI: Tombol sekarang mengarah ke Kalkulator dengan membawa ID */}
              <Link 
                href={`/calculator?id=${item.id}`}
                className="w-full flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 text-sm font-bold rounded-lg border border-slate-200 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <Eye className="w-4 h-4" /> Lihat / Edit Detail
              </Link>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-300 rounded-2xl">
              <p className="text-slate-500 mb-4">Belum ada data tersimpan.</p>
              <Link href="/calculator" className="text-orange-600 font-bold hover:underline">Buat Sekarang</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}