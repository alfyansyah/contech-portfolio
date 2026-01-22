"use client";

import { useState } from 'react';
import { Calculator, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function CalculatorPage() {
  // State untuk menyimpan input user
  const [volume, setVolume] = useState<number | ''>('');
  const [ratio, setRatio] = useState('1:2:3'); // Default rasio K-175/K-225 standar lapangan
  
  // State untuk menyimpan hasil hitungan
  const [result, setResult] = useState<null | { semen: number, pasir: number, kerikil: number }>(null);

  const calculateMaterial = () => {
    const vol = Number(volume);
    if (!vol) return;

    // RUMUS SEDERHANA (Estimasi SNI untuk K-225 / 1:2:3)
    // Koefisien per m3 beton:
    // Semen: 326kg (~8 sak @40kg) | Pasir: 0.54 m3 | Kerikil: 0.82 m3
    // Kita buat dinamis sedikit berdasarkan rasio (logika sederhana)
    
    let semenCoef = 8.15; // sak
    let pasirCoef = 0.54; // m3
    let kerikilCoef = 0.82; // m3

    if (ratio === '1:3:5') {
        semenCoef = 6.5; 
        pasirCoef = 0.58; 
        kerikilCoef = 0.85;
    }

    setResult({
      semen: Math.ceil(vol * semenCoef), // Dibulatkan ke atas (beli sak harus utuh)
      pasir: Number((vol * pasirCoef).toFixed(2)),
      kerikil: Number((vol * kerikilCoef).toFixed(2)),
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header App */}
        <div className="bg-slate-900 p-6 text-white">
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-4 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">BetonCalc Pro</h1>
              <p className="text-slate-400 text-xs">AI-Powered Estimator</p>
            </div>
          </div>
        </div>

        {/* Form Input */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Volume Cor (m³)</label>
            <input 
              type="number" 
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              placeholder="Contoh: 15"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-mono text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mutu / Rasio Campuran</label>
            <select 
              value={ratio}
              onChange={(e) => setRatio(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
            >
              <option value="1:2:3">K-225 (Standar Struktur 1:2:3)</option>
              <option value="1:3:5">K-175 (Cor Lantai Kerja 1:3:5)</option>
            </select>
          </div>

          <button 
            onClick={calculateMaterial}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-orange-200 active:scale-95"
          >
            HITUNG KEBUTUHAN
          </button>
        </div>

        {/* Hasil Perhitungan */}
        {result && (
          <div className="bg-slate-900 p-6 mx-4 mb-6 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
              Estimasi Material
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white mb-1">{result.semen}</div>
                <div className="text-[10px] text-slate-400 uppercase">Sak Semen</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500 mb-1">{result.pasir}</div>
                <div className="text-[10px] text-slate-400 uppercase">Pasir (m³)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">{result.kerikil}</div>
                <div className="text-[10px] text-slate-400 uppercase">Kerikil (m³)</div>
              </div>
            </div>
            
            <button className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-300 hover:text-white py-2 border border-slate-700 rounded hover:bg-slate-800 transition-colors">
              <Save className="w-3 h-3" /> Simpan ke Laporan (Demo)
            </button>
          </div>
        )}
      </div>
    </main>
  );
}