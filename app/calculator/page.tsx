"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Import Supabase
import { useRouter } from 'next/navigation';
import { Calculator, ArrowLeft, Download, Save, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { jsPDF } from 'jspdf';

export default function CalculatorPage() {
  const router = useRouter();
  
  // State User
  const [user, setUser] = useState<any>(null);
  
  // State Input
  const [projectName, setProjectName] = useState(''); // Nama Proyek Baru
  const [volume, setVolume] = useState<number | ''>('');
  const [ratio, setRatio] = useState('1:2:3'); 
  
  // State Hasil
  const [result, setResult] = useState<null | { 
    semen: number, pasir: number, kerikil: number, estimasiBiaya: number 
  }>(null);

  const [isSaving, setIsSaving] = useState(false);

  // Cek User saat load
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const HARGA = { semen: 65000, pasir: 250000, kerikil: 280000 };

  const calculateMaterial = () => {
    const vol = Number(volume);
    if (!vol) return;

    let semenCoef = 8.15; let pasirCoef = 0.54; let kerikilCoef = 0.82; 
    if (ratio === '1:3:5') { semenCoef = 6.5; pasirCoef = 0.58; kerikilCoef = 0.85; }

    const hitungSemen = Math.ceil(vol * semenCoef);
    const hitungPasir = Number((vol * pasirCoef).toFixed(2));
    const hitungKerikil = Number((vol * kerikilCoef).toFixed(2));

    const totalBiaya = (hitungSemen * HARGA.semen) + (hitungPasir * HARGA.pasir) + (hitungKerikil * HARGA.kerikil);

    setResult({ semen: hitungSemen, pasir: hitungPasir, kerikil: hitungKerikil, estimasiBiaya: totalBiaya });
  };

  // --- FUNGSI SIMPAN KE DATABASE ---
  const saveProject = async () => {
    if (!user) {
        alert("Silakan login dulu untuk menyimpan proyek!");
        router.push('/auth');
        return;
    }
    if (!result || !projectName.trim()) {
        alert("Masukkan Nama Proyek dan hitung dulu!");
        return;
    }

    setIsSaving(true);

    const { error } = await supabase.from('saved_rabs').insert({
        user_id: user.id,
        project_name: projectName,
        volume: Number(volume),
        ratio: ratio,
        total_cost: result.estimasiBiaya,
        detail_material: result // Simpan detail semen/pasir sebagai JSON
    });

    setIsSaving(false);

    if (error) {
        alert("Gagal menyimpan: " + error.message);
    } else {
        alert("Berhasil disimpan!");
        router.push('/dashboard'); // Pindah ke dashboard setelah simpan
    }
  };

  // FUNGSI PDF (Sama seperti sebelumnya)
  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    // ... (Kode PDF sama, dipersingkat di sini agar tidak kepanjangan) ...
    // LOGIKA PDF SEDERHANA UNTUK DEMO
    doc.text(`RAB PROYEK: ${projectName || 'Tanpa Nama'}`, 20, 20);
    doc.text(`Total: Rp ${result.estimasiBiaya.toLocaleString()}`, 20, 30);
    doc.save('RAB.pdf');
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 font-sans flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header App */}
        <div className="bg-slate-900 p-6 text-white">
          <div className="flex justify-between items-center mb-6">
             <Link href={user ? "/dashboard" : "/"} className="inline-flex items-center text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> {user ? "Ke Dashboard" : "Ke Home"}
             </Link>
             {user && (
                 <span className="text-xs bg-slate-800 px-2 py-1 rounded text-orange-400 font-mono">Logged in</span>
             )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-600 rounded-xl shadow-lg">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">BetonCalc Pro</h1>
              <p className="text-slate-400 text-sm">Hitung & Simpan RAB</p>
            </div>
          </div>
        </div>

        {/* Form Input */}
        <div className="p-8 space-y-6">
          
          {/* Input Nama Proyek (BARU) */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Proyek</label>
            <input 
              type="text" 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Contoh: Cor Lantai 2 Rumah Pak Budi"
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Volume (m³)</label>
                <input 
                type="number" 
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                placeholder="0"
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-mono text-lg font-bold"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mutu</label>
                <select 
                value={ratio}
                onChange={(e) => setRatio(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white"
                >
                <option value="1:2:3">K-225</option>
                <option value="1:3:5">K-175</option>
                </select>
            </div>
          </div>

          <button 
            onClick={calculateMaterial}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            Hitung Sekarang
          </button>
        </div>

        {/* Hasil Perhitungan */}
        {result && (
          <div className="bg-slate-50 p-6 border-t border-slate-200 animate-in slide-in-from-bottom-4 duration-500">
            
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 text-center">
                <span className="text-xs text-slate-500 uppercase font-bold">Total Estimasi</span>
                <div className="text-2xl font-bold text-orange-600">Rp {result.estimasiBiaya.toLocaleString('id-ID')}</div>
                <div className="text-xs text-slate-400 mt-1">Semen: {result.semen} sak | Pasir: {result.pasir} m³ | Split: {result.kerikil} m³</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                 <button 
                    onClick={downloadPDF}
                    className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 py-3 border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
                 >
                    <Download className="w-4 h-4" /> PDF
                 </button>
                 
                 {/* TOMBOL SAVE (LOGIC BARU) */}
                 {user ? (
                     <button 
                        onClick={saveProject}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 text-sm font-bold text-white bg-slate-900 hover:bg-orange-600 py-3 rounded-xl shadow-lg transition-all"
                     >
                        {isSaving ? 'Menyimpan...' : <><Save className="w-4 h-4" /> Simpan Data</>}
                     </button>
                 ) : (
                    <Link href="/auth" className="flex items-center justify-center gap-2 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 py-3 rounded-xl shadow-lg transition-all">
                        Login untuk Simpan
                    </Link>
                 )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}