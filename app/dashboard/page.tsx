"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calculator, ArrowLeft, Download, Save, MapPin, Package, Building2 } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- DATA MASTER AHSP (Tetap Sama) ---
const DATA_AHSP: any = {
  'pekerjaan_tanah': [
    { id: 'galian', nama: 'Galian Tanah Biasa (1m)', unit: 'm³', harga_dasar: 85000, koef: {} },
    { id: 'urugan', nama: 'Urugan Pasir', unit: 'm³', harga_dasar: 250000, koef: { 'Pasir Urug': 1.2 } },
  ],
  'pondasi': [
    { id: 'batu_kali', nama: 'Pondasi Batu Kali (1:4)', unit: 'm³', harga_dasar: 950000, koef: { 'Batu Belah': 1.2, 'Semen': 3.26, 'Pasir': 0.52 } },
    { id: 'footplate', nama: 'Pondasi Cakar Ayam', unit: 'm³', harga_dasar: 3500000, koef: { 'Besi': 150, 'Semen': 7, 'Pasir': 0.5, 'Split': 0.8 } },
  ],
  'struktur': [
    { id: 'sloof', nama: 'Sloof Beton (15x20)', unit: 'm³', harga_dasar: 4200000, koef: { 'Besi': 180, 'Semen': 7.5, 'Pasir': 0.6, 'Split': 0.8 } },
    { id: 'kolom', nama: 'Kolom Praktis (15x15)', unit: 'm¹', harga_dasar: 120000, koef: { 'Besi': 4, 'Semen': 0.3, 'Pasir': 0.02, 'Split': 0.03 } },
  ],
  'dinding': [
    { id: 'bata_merah', nama: 'Pas. Bata Merah', unit: 'm²', harga_dasar: 145000, koef: { 'Bata Merah': 70, 'Semen': 0.2, 'Pasir': 0.04 } },
    { id: 'hebel', nama: 'Pas. Hebel/Ringan', unit: 'm²', harga_dasar: 110000, koef: { 'Hebel': 0.1, 'Perekat': 0.1 } },
  ],
  'lantai': [
    { id: 'keramik_60', nama: 'Pas. Keramik 60x60', unit: 'm²', harga_dasar: 250000, koef: { 'Keramik': 1.05, 'Semen': 0.2 } },
  ],
  'cat': [
    { id: 'cat_dinding', nama: 'Cat Dinding (2x)', unit: 'm²', harga_dasar: 45000, koef: { 'Cat Tembok': 0.25 } },
  ]
};

const REGIONAL_INDEX: any = {
  'jakarta': { nama: 'DKI Jakarta', index: 1.0 },
  'jabar': { nama: 'Jawa Barat', index: 0.9 },
  'jateng': { nama: 'Jawa Tengah', index: 0.85 },
  'jatim': { nama: 'Jawa Timur', index: 0.9 },
  'bali': { nama: 'Bali', index: 1.1 },
  'papua': { nama: 'Papua', index: 1.8 },
};

// --- HELPER UNTUK GAMBAR PDF ---
// Fungsi ini mengubah URL gambar menjadi Base64 agar bisa dicetak di PDF
const getBase64FromUrl = async (url: string): Promise<string> => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = () => {
      const base64data = reader.result;   
      resolve(base64data as string);
    }
  });
}

function CalculatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null); // DATA PERUSAHAAN USER
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('jakarta');
  const [items, setItems] = useState<any[]>([]); 
  const [isSaving, setIsSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false); // Loading saat bikin PDF

  // Input States
  const [selectedCategory, setSelectedCategory] = useState('pekerjaan_tanah');
  const [selectedWork, setSelectedWork] = useState(DATA_AHSP['pekerjaan_tanah'][0].id);
  const [inputVolume, setInputVolume] = useState<number | ''>('');
  
  // Custom Input States
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customUnit, setCustomUnit] = useState('ls');
  const [customPrice, setCustomPrice] = useState<number | ''>('');

  // 1. CEK USER & LOAD PROFIL PERUSAHAAN
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/auth');
      } else {
        setUser(user);
        
        // AMBIL DATA PROFIL (WHITE LABEL)
        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (profileData) setProfile(profileData);
        setIsCheckingUser(false);
      }
    };
    checkUser();
  }, [router]);

  // 2. LOAD DATA PROYEK (Jika Edit)
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      setLoadingData(true);
      const { data } = await supabase
        .from('saved_rabs')
        .select('*')
        .eq('id', projectId)
        .single();

      if (data) {
        setProjectName(data.project_name);
        if (data.detail_material?.items) setItems(data.detail_material.items);
      }
      setLoadingData(false);
    };
    if (user) loadProject();
  }, [projectId, user]);

  // --- LOGIC FUNCTIONS ---
  const generateMaterialDetails = (workId: string, category: string, vol: number) => {
    const workData = DATA_AHSP[category]?.find((w: any) => w.id === workId);
    if (!workData || !workData.koef) return "-";
    return Object.entries(workData.koef).map(([mat, k]: any) => {
       const qty = (k * vol).toFixed(2);
       let unit = 'Satuan';
       if(['Semen','Perekat'].includes(mat)) unit = 'Sak';
       if(['Pasir','Split','Batu Belah'].includes(mat)) unit = 'm³';
       if(mat === 'Bata Merah') unit = 'Bh'; if(mat === 'Besi') unit = 'Kg';
       return `${qty} ${unit} ${mat}`;
    }).join(', ');
  };

  const addItem = () => {
    if (!inputVolume) return alert("Masukkan Volume!");
    const workData = DATA_AHSP[selectedCategory].find((w: any) => w.id === selectedWork);
    const regionalIdx = REGIONAL_INDEX[location].index;
    const finalPrice = Math.round(workData.harga_dasar * regionalIdx);
    const materialDetail = generateMaterialDetails(selectedWork, selectedCategory, Number(inputVolume));

    setItems([...items, {
      id: Date.now(), workName: workData.nama, materialDetail: materialDetail,
      unit: workData.unit, volume: Number(inputVolume),
      unitPrice: finalPrice, totalPrice: finalPrice * Number(inputVolume), isCustom: false
    }]);
    setInputVolume('');
  };

  const addCustomItem = () => {
    if (!customName || !inputVolume || !customPrice) return alert("Lengkapi data!");
    setItems([...items, {
      id: Date.now(), workName: customName, materialDetail: "Item Custom",
      unit: customUnit, volume: Number(inputVolume),
      unitPrice: Number(customPrice), totalPrice: Number(customPrice) * Number(inputVolume), isCustom: true
    }]);
    setCustomName(''); setInputVolume(''); setCustomPrice('');
  };

  const updatePrice = (id: number, newPrice: number) => {
    setItems(items.map(item => item.id === id ? { ...item, unitPrice: newPrice, totalPrice: newPrice * item.volume } : item));
  };
  const deleteItem = (id: number) => setItems(items.filter(i => i.id !== id));
  const grandTotal = items.reduce((acc, curr) => acc + curr.totalPrice, 0);

  const saveProject = async () => {
    if (!items.length) { alert("Data kosong!"); return; }
    setIsSaving(true);
    const { error } = await supabase.from('saved_rabs').insert({
        user_id: user.id, project_name: projectName, volume: 1, ratio: location, total_cost: grandTotal,
        detail_material: { items, location: REGIONAL_INDEX[location] }
    });
    setIsSaving(false);
    if (error) alert(error.message); else router.push('/dashboard');
  };

  // --- PDF GENERATOR (DENGAN LOGO USER) ---
  const downloadPDF = async () => {
    setPdfGenerating(true);
    try {
      const doc = new jsPDF() as any;
      const regionName = REGIONAL_INDEX[location].nama;
      
      // LOGIKA KOP SURAT (WHITE LABEL)
      let yStart = 20;
      
      if (profile?.logo_url) {
          try {
              // Convert URL Logo User ke Base64
              const imgBase64 = await getBase64FromUrl(profile.logo_url);
              // Tambahkan Logo: (image, format, x, y, width, height)
              doc.addImage(imgBase64, 'JPEG', 15, 10, 25, 25);
          } catch (e) {
              console.error("Gagal load logo user", e);
          }
      }

      // Nama Perusahaan User (atau Default ConTech)
      doc.setFontSize(18); doc.setTextColor(40, 40, 40);
      doc.text(profile?.company_name || "CONTECH LABS", 45, 20); // Geser teks ke kanan (x=45) biar gak nabrak logo
      
      doc.setFontSize(10); doc.setTextColor(100);
      const alamat = profile?.company_address || "Digital Construction Solutions";
      doc.text(alamat, 45, 26);
      
      doc.setLineWidth(0.5);
      doc.line(15, 40, 195, 40);

      // Judul Dokumen
      doc.setFontSize(14); doc.setTextColor(0); 
      doc.text("REKAPITULASI RAB", 105, 55, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text(`Proyek : ${projectName || '-'}`, 15, 70);
      doc.text(`Lokasi : ${regionName}`, 15, 76);
      doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 150, 70);

      const tableData = items.map(item => [
          item.workName + `\n(${item.materialDetail})`,
          `${item.volume} ${item.unit}`,
          `Rp ${item.unitPrice.toLocaleString()}`,
          `Rp ${item.totalPrice.toLocaleString()}`
      ]);

      autoTable(doc, {
          startY: 85,
          head: [['Pekerjaan / Material', 'Vol', 'Hrg Sat', 'Total']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [40, 40, 40] }, // Warna Netral (Hitam/Abu) biar masuk ke logo user apa aja
          foot: [['', '', 'TOTAL', `Rp ${grandTotal.toLocaleString()}`]],
          footStyles: { fillColor: [234, 88, 12], fontSize: 12 } // Aksen Orange tetap ada di Total
      });

      doc.save(`RAB-${projectName}.pdf`);
    } catch (e) {
      alert("Gagal generate PDF. Coba lagi.");
      console.error(e);
    } finally {
        setPdfGenerating(false);
    }
  };

  if (isCheckingUser || loadingData) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 mt-6 pb-20">
        <nav className="flex justify-between items-center mb-6 bg-slate-900 text-white p-4 rounded-xl">
             <Link href="/dashboard" className="flex items-center gap-2 hover:text-orange-400"><ArrowLeft className="w-5 h-5" /> Dash</Link>
             <h1 className="font-bold">Estimator Pro V3</h1>
        </nav>

        {/* INFO */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-orange-600" /> Info Proyek</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg" placeholder="Nama Proyek..." />
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg bg-white">
                    {Object.keys(REGIONAL_INDEX).map(key => <option key={key} value={key}>{REGIONAL_INDEX[key].nama}</option>)}
                </select>
            </div>
        </div>

        {/* INPUT */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-slate-800 flex items-center gap-2"><Calculator className="w-5 h-5 text-orange-600" /> Input Data</h2>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => setIsCustom(false)} className={`px-3 py-1 text-xs font-bold rounded ${!isCustom ? 'bg-white shadow' : 'text-slate-500'}`}>Database</button>
                    <button onClick={() => setIsCustom(true)} className={`px-3 py-1 text-xs font-bold rounded ${isCustom ? 'bg-white shadow' : 'text-slate-500'}`}>Custom</button>
                </div>
            </div>
            
            {!isCustom ? (
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
                    <div className="md:col-span-2"><button onClick={addItem} className="w-full bg-slate-900 text-white p-2 rounded-lg text-sm font-bold">Tambah</button></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-4"><label className="text-[10px] font-bold text-slate-400">NAMA</label><input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm" /></div>
                    <div className="md:col-span-2"><label className="text-[10px] font-bold text-slate-400">SATUAN</label><input type="text" value={customUnit} onChange={(e) => setCustomUnit(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm" /></div>
                    <div className="md:col-span-2"><label className="text-[10px] font-bold text-slate-400">VOL</label><input type="number" value={inputVolume} onChange={(e) => setInputVolume(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded-lg text-sm" /></div>
                    <div className="md:col-span-2"><label className="text-[10px] font-bold text-slate-400">HARGA</label><input type="number" value={customPrice} onChange={(e) => setCustomPrice(Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded-lg text-sm" /></div>
                    <div className="md:col-span-2"><button onClick={addCustomItem} className="w-full bg-orange-600 text-white p-2 rounded-lg text-sm font-bold">Add</button></div>
                </div>
            )}
        </div>

        {/* TABEL HASIL */}
        {items.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-20">
                
                {/* Header Profil (Preview White Label di Layar) */}
                {profile && (
                    <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-3">
                        <div className="text-xs text-slate-400 uppercase font-bold">RAB Prepared By:</div>
                        <div className="flex items-center gap-2">
                            {profile.logo_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={profile.logo_url} alt="Logo" className="w-6 h-6 object-contain" />
                            ) : <Building2 className="w-4 h-4 text-slate-400"/>}
                            <span className="font-bold text-slate-700">{profile.company_name || "ConTech User"}</span>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr><th className="p-3">Uraian & Material</th><th className="p-3 text-right">Vol</th><th className="p-3 text-right">Hrg Sat</th><th className="p-3 text-right">Total</th><th className="p-3"></th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="p-3">
                                        <div className="font-bold text-slate-700">{item.workName}</div>
                                        <div className="text-[10px] text-orange-600 mt-1 flex items-center gap-1"><Package className="w-3 h-3" /> {item.materialDetail}</div>
                                    </td>
                                    <td className="p-3 text-right">{item.volume} {item.unit}</td>
                                    <td className="p-3 text-right"><input type="number" value={item.unitPrice} onChange={(e) => updatePrice(item.id, Number(e.target.value))} className="w-20 p-1 text-right border rounded bg-white" /></td>
                                    <td className="p-3 text-right font-bold">Rp {Math.round(item.totalPrice).toLocaleString()}</td>
                                    <td className="p-3 text-center"><button onClick={() => deleteItem(item.id)} className="text-red-400 font-bold">x</button></td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-900 text-white">
                            <tr><td colSpan={3} className="p-4 text-right font-bold">TOTAL</td><td colSpan={2} className="p-4 font-bold text-lg text-orange-400">Rp {Math.round(grandTotal).toLocaleString('id-ID')}</td></tr>
                        </tfoot>
                    </table>
                </div>
                <div className="p-4 bg-slate-50 flex gap-3 justify-end">
                     <button onClick={downloadPDF} disabled={pdfGenerating} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-white">
                        {pdfGenerating ? 'Generating...' : <><Download className="w-4 h-4" /> PDF</>}
                     </button>
                     <button onClick={saveProject} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700">{isSaving ? '...' : 'Simpan'}</button>
                </div>
            </div>
        )}
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
        <CalculatorContent />
      </Suspense>
    </main>
  );
}