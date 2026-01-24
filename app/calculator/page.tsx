"use client";

// PERBAIKAN DI SINI: Menambahkan "React" agar tidak error UMD global
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Calculator, ArrowLeft, Download, Save, MapPin, ChevronRight, PlusCircle, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// --- DATA MASTER AHSP ---
const DATA_AHSP: any = {
  'pekerjaan_tanah': [
    { id: 'galian', nama: 'Galian Tanah Biasa (sedalam 1m)', unit: 'm³', harga_dasar: 85000 },
    { id: 'urugan', nama: 'Urugan Pasir Bawah Pondasi', unit: 'm³', harga_dasar: 250000 },
  ],
  'pondasi': [
    { id: 'batu_kali', nama: 'Pondasi Batu Kali (1:4)', unit: 'm³', harga_dasar: 950000 },
    { id: 'footplate', nama: 'Pondasi Footplate (Cakar Ayam)', unit: 'm³', harga_dasar: 3500000 },
  ],
  'struktur': [
    { id: 'sloof', nama: 'Sloof Beton Bertulang (15x20)', unit: 'm³', harga_dasar: 4200000 },
    { id: 'kolom', nama: 'Kolom Praktis (15x15)', unit: 'm¹', harga_dasar: 120000 },
    { id: 'balok', nama: 'Balok Gantung', unit: 'm³', harga_dasar: 4500000 },
  ],
  'dinding': [
    { id: 'bata_merah', nama: 'Pas. Bata Merah (1:4)', unit: 'm²', harga_dasar: 145000 },
    { id: 'hebel', nama: 'Pas. Hebel/Ringan', unit: 'm²', harga_dasar: 110000 },
    { id: 'plester', nama: 'Plesteran Dinding', unit: 'm²', harga_dasar: 65000 },
    { id: 'aci', nama: 'Acian Semen', unit: 'm²', harga_dasar: 35000 },
  ],
  'lantai': [
    { id: 'keramik_60', nama: 'Pas. Keramik 60x60', unit: 'm²', harga_dasar: 250000 },
    { id: 'keramik_40', nama: 'Pas. Keramik 40x40', unit: 'm²', harga_dasar: 180000 },
  ],
  'cat': [
    { id: 'cat_dinding', nama: 'Pengecatan Dinding (2x Lapis)', unit: 'm²', harga_dasar: 45000 },
    { id: 'cat_plafon', nama: 'Pengecatan Plafon', unit: 'm²', harga_dasar: 50000 },
  ]
};

const REGIONAL_INDEX: any = {
  'jakarta': { nama: 'DKI Jakarta', index: 1.0 },
  'jabar': { nama: 'Jawa Barat', index: 0.9 },
  'jateng': { nama: 'Jawa Tengah', index: 0.85 },
  'jatim': { nama: 'Jawa Timur', index: 0.9 },
  'bali': { nama: 'Bali', index: 1.1 },
  'kaltim': { nama: 'Kalimantan Timur', index: 1.25 },
  'papua': { nama: 'Papua', index: 1.8 },
};

export default function CalculatorPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('jakarta');
  const [items, setItems] = useState<any[]>([]); 
  const [isSaving, setIsSaving] = useState(false);

  // Input Standard
  const [selectedCategory, setSelectedCategory] = useState('pekerjaan_tanah');
  const [selectedWork, setSelectedWork] = useState(DATA_AHSP['pekerjaan_tanah'][0].id);
  const [inputVolume, setInputVolume] = useState<number | ''>('');

  // Input Custom (Manual)
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customUnit, setCustomUnit] = useState('ls'); // lump sum
  const [customPrice, setCustomPrice] = useState<number | ''>('');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  // --- LOGIKA TAMBAH ITEM (STANDARD) ---
  const addItem = () => {
    if (!inputVolume) return alert("Masukkan Volume!");
    
    const workData = DATA_AHSP[selectedCategory].find((w: any) => w.id === selectedWork);
    const regionalIdx = REGIONAL_INDEX[location].index;
    const finalPrice = Math.round(workData.harga_dasar * regionalIdx);

    const newItem = {
      id: Date.now(),
      workName: workData.nama,
      unit: workData.unit,
      volume: Number(inputVolume),
      unitPrice: finalPrice, // Harga ini nanti bisa diedit user
      totalPrice: finalPrice * Number(inputVolume),
      isCustom: false
    };

    setItems([...items, newItem]);
    setInputVolume('');
  };

  // --- LOGIKA TAMBAH ITEM (CUSTOM MANUAL) ---
  const addCustomItem = () => {
    if (!customName || !inputVolume || !customPrice) return alert("Data custom belum lengkap!");

    const newItem = {
      id: Date.now(),
      workName: customName,
      unit: customUnit,
      volume: Number(inputVolume),
      unitPrice: Number(customPrice),
      totalPrice: Number(customPrice) * Number(inputVolume),
      isCustom: true
    };

    setItems([...items, newItem]);
    setCustomName(''); setInputVolume(''); setCustomPrice('');
  };

  // --- LOGIKA EDIT HARGA ---
  const updatePrice = (id: number, newPrice: number) => {
    const updatedItems = items.map(item => {
        if (item.id === id) {
            return { ...item, unitPrice: newPrice, totalPrice: newPrice * item.volume };
        }
        return item;
    });
    setItems(updatedItems);
  };

  const deleteItem = (id: number) => { setItems(items.filter(i => i.id !== id)); };

  const grandTotal = items.reduce((acc, curr) => acc + curr.totalPrice, 0);

  const saveProject = async () => {
    if (!user) { router.push('/auth'); return; }
    if (!items.length) { alert("Belum ada item!"); return; }
    setIsSaving(true);
    const { error } = await supabase.from('saved_rabs').insert({
        user_id: user.id,
        project_name: projectName,
        volume: 1, ratio: location, total_cost: grandTotal,
        detail_material: { items, location: REGIONAL_INDEX[location] }
    });
    setIsSaving(false);
    if (error) alert("Gagal: " + error.message);
    else router.push('/dashboard');
  };

  const downloadPDF = () => {
    const doc = new jsPDF() as any; 
    const regionName = REGIONAL_INDEX[location].nama;
    
    doc.setFontSize(18); doc.setTextColor(234, 88, 12); doc.text("CONTECH LABS", 15, 20);
    doc.setFontSize(10); doc.setTextColor(100); doc.text("Professional Estimator Tool", 15, 25);
    doc.line(15, 30, 195, 30);

    doc.setFontSize(14); doc.setTextColor(0); doc.text("REKAPITULASI RAB", 105, 45, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Proyek : ${projectName || '-'}`, 15, 60);
    doc.text(`Lokasi : ${regionName}`, 15, 66);

    const tableData = items.map(item => [
        item.workName,
        `${item.volume} ${item.unit}`,
        `Rp ${item.unitPrice.toLocaleString()}`,
        `Rp ${item.totalPrice.toLocaleString()}`
    ]);

    doc.autoTable({
        startY: 75,
        head: [['Uraian Pekerjaan', 'Volume', 'Hrg Satuan', 'Total']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [234, 88, 12] },
        foot: [['', '', 'GRAND TOTAL', `Rp ${grandTotal.toLocaleString()}`]],
        footStyles: { fillColor: [20, 20, 20], fontSize: 12 }
    });

    doc.save(`RAB-${projectName}.pdf`);
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-20">
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
             <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 hover:text-orange-400 transition">
                <ArrowLeft className="w-5 h-5" /> <span className="hidden sm:inline">Dashboard</span>
             </Link>
             <h1 className="font-bold text-lg">Estimator V2 (Editable)</h1>
             <div className="text-xs bg-green-600 px-2 py-1 rounded font-mono">LIVE</div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-4 mt-6">
        
        {/* INFO PROYEK */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-orange-600" /> Info Proyek</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg" placeholder="Nama Proyek..." />
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg bg-white">
                    {Object.keys(REGIONAL_INDEX).map(key => <option key={key} value={key}>{REGIONAL_INDEX[key].nama}</option>)}
                </select>
            </div>
        </div>

        {/* INPUT ITEM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
             <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-orange-600" /> Input Data
                </h2>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => setIsCustom(false)} className={`px-3 py-1 text-xs font-bold rounded ${!isCustom ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>Database</button>
                    <button onClick={() => setIsCustom(true)} className={`px-3 py-1 text-xs font-bold rounded ${isCustom ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>Custom</button>
                </div>
             </div>
            
            {!isCustom ? (
                // MODE STANDARD
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-3">
                        <label className="text-[10px] font-bold text-slate-400">KATEGORI</label>
                        <select value={selectedCategory} onChange={(e) => {setSelectedCategory(e.target.value); setSelectedWork(DATA_AHSP[e.target.value][0].id)}} className="w-full p-2 border border-slate-200 rounded-lg text-sm"><option value="pekerjaan_tanah">Tanah</option><option value="pondasi">Pondasi</option><option value="struktur">Struktur</option><option value="dinding">Dinding</option><option value="lantai">Lantai</option><option value="cat">Cat</option></select>
                    </div>
                    <div className="md:col-span-5">
                        <label className="text-[10px] font-bold text-slate-400">ITEM</label>
                        <select value={selectedWork} onChange={(e) => setSelectedWork(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm">{DATA_AHSP[selectedCategory].map((w: any) => <option key={w.id} value={w.id}>{w.nama}</option>)}</select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400">VOLUME</label>
                        <input type="number" value={inputVolume} onChange={(e) => setInputVolume(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="0" />
                    </div>
                    <div className="md:col-span-2">
                        <button onClick={addItem} className="w-full bg-slate-900 text-white p-2 rounded-lg text-sm font-bold hover:bg-orange-600">Tambah</button>
                    </div>
                </div>
            ) : (
                // MODE CUSTOM
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-4">
                        <label className="text-[10px] font-bold text-slate-400">NAMA PEKERJAAN</label>
                        <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="Contoh: Pasang Lampu" />
                    </div>
                    <div className="md:col-span-2">
                         <label className="text-[10px] font-bold text-slate-400">SATUAN</label>
                         <input type="text" value={customUnit} onChange={(e) => setCustomUnit(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="ls/bh" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400">VOL</label>
                        <input type="number" value={inputVolume} onChange={(e) => setInputVolume(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="0" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400">HARGA SATUAN</label>
                        <input type="number" value={customPrice} onChange={(e) => setCustomPrice(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="Rp" />
                    </div>
                    <div className="md:col-span-2">
                        <button onClick={addCustomItem} className="w-full bg-orange-600 text-white p-2 rounded-lg text-sm font-bold hover:bg-orange-700">Add</button>
                    </div>
                </div>
            )}
        </div>

        {/* TABEL HASIL (EDITABLE) */}
        {items.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-20 animate-in slide-in-from-bottom-5">
                <div className="p-4 bg-orange-50 border-b border-orange-100 flex justify-between items-center">
                    <h3 className="font-bold text-orange-800 text-sm sm:text-base">Rincian RAB (Klik Harga untuk Edit)</h3>
                    <div className="text-xs text-orange-600 bg-white px-2 py-1 rounded border border-orange-200">{REGIONAL_INDEX[location].nama}</div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="p-3 w-[40%]">Uraian</th>
                                <th className="p-3 text-right">Vol</th>
                                <th className="p-3 text-right w-[20%]">Hrg Satuan (Edit)</th>
                                <th className="p-3 text-right">Total</th>
                                <th className="p-3 text-center">x</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-medium text-slate-700">
                                        {item.workName}
                                        {item.isCustom && <span className="ml-2 text-[10px] bg-slate-200 px-1 rounded">Custom</span>}
                                    </td>
                                    <td className="p-3 text-right">{item.volume} {item.unit}</td>
                                    <td className="p-3 text-right">
                                        {/* EDITABLE INPUT */}
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                value={item.unitPrice} 
                                                onChange={(e) => updatePrice(item.id, Number(e.target.value))}
                                                className="w-24 p-1 text-right border border-slate-200 rounded focus:border-orange-500 outline-none bg-white font-mono text-slate-600 focus:bg-orange-50"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-3 text-right font-bold text-slate-900">{Math.round(item.totalPrice).toLocaleString()}</td>
                                    <td className="p-3 text-center">
                                        <button onClick={() => deleteItem(item.id)} className="text-red-300 hover:text-red-500 font-bold">x</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-900 text-white">
                            <tr>
                                <td colSpan={3} className="p-4 text-right font-bold text-xs sm:text-sm">GRAND TOTAL</td>
                                <td colSpan={2} className="p-4 font-bold text-base sm:text-lg text-orange-400">Rp {Math.round(grandTotal).toLocaleString('id-ID')}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="p-4 bg-slate-50 flex gap-3 justify-end">
                     <button onClick={downloadPDF} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-white transition text-xs sm:text-sm">
                        <Download className="w-4 h-4" /> PDF
                     </button>
                     {user ? (
                        <button onClick={saveProject} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition shadow-lg text-xs sm:text-sm">
                            {isSaving ? '...' : <><Save className="w-4 h-4" /> Simpan</>}
                        </button>
                     ) : (
                        <Link href="/auth" className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg font-bold text-xs sm:text-sm">Login</Link>
                     )}
                </div>
            </div>
        )}
      </div>
    </main>
  );
}