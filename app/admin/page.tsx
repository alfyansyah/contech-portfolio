"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Users, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allProjects, setAllProjects] = useState<any[]>([]);

  // Masukkan Email Anda di sini untuk verifikasi di frontend juga
  const MY_EMAIL = "alfyansyah.syah@gmail.com"; // GANTI DENGAN EMAIL ANDA

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Cek apakah yang login itu Anda?
      if (!user || user.email !== MY_EMAIL) {
        alert("Akses Ditolak! Halaman ini khusus CEO.");
        router.push('/dashboard');
        return;
      }
      
      setIsAdmin(true);

      // Ambil SEMUA data dari database (tanpa filter user_id)
      const { data, error } = await supabase
        .from('saved_rabs')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setAllProjects(data);
      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading) return <div className="p-10 text-center">Verifikasi Admin...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-6">
      <nav className="flex justify-between items-center mb-10 border-b border-slate-700 pb-4">
        <div className="flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-red-500" />
            <div>
                <h1 className="text-2xl font-bold">CEO Dashboard</h1>
                <p className="text-xs text-slate-400">Panel Kontrol Utama</p>
            </div>
        </div>
        <Link href="/dashboard" className="text-sm hover:text-orange-400 flex gap-2"><ArrowLeft className="w-4 h-4"/> Back to App</Link>
      </nav>

      {/* STATISTIK RINGKAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-900/50 text-blue-400 rounded-lg"><FileText /></div>
                <div>
                    <div className="text-3xl font-bold">{allProjects.length}</div>
                    <div className="text-xs text-slate-400">Total Proyek Dibuat</div>
                </div>
            </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-green-900/50 text-green-400 rounded-lg"><Users /></div>
                <div>
                    <div className="text-3xl font-bold">Rp {(allProjects.reduce((a, b) => a + (b.total_cost || 0), 0) / 1000000).toFixed(0)} Jt</div>
                    <div className="text-xs text-slate-400">Total Nilai Estimasi (System)</div>
                </div>
            </div>
        </div>
      </div>

      {/* TABEL SEMUA DATA */}
      <div className="bg-white text-slate-900 rounded-2xl overflow-hidden">
        <div className="p-4 bg-slate-100 border-b border-slate-200 font-bold">Live Activity Feed</div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500">
                    <tr>
                        <th className="p-3">ID</th>
                        <th className="p-3">User ID (UUID)</th>
                        <th className="p-3">Nama Proyek</th>
                        <th className="p-3">Lokasi</th>
                        <th className="p-3 text-right">Nilai RAB</th>
                        <th className="p-3">Tanggal</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {allProjects.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono text-xs">{p.id}</td>
                            <td className="p-3 font-mono text-xs text-slate-400">{p.user_id.substring(0,8)}...</td>
                            <td className="p-3 font-bold">{p.project_name}</td>
                            <td className="p-3"><span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">{p.ratio}</span></td>
                            <td className="p-3 text-right">Rp {p.total_cost?.toLocaleString()}</td>
                            <td className="p-3 text-slate-500">{new Date(p.created_at).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}