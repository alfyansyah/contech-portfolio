"use client";

// 1. PERBAIKAN: Tambah 'React' di sini agar error UMD hilang
import React, { useState, useEffect } from 'react';

// 2. PERBAIKAN: Ganti '@' dengan '../../' agar pasti ketemu filenya
import { supabase } from '../../lib/supabase';

import { useRouter } from 'next/navigation';
import { Building2, Save, ArrowLeft, UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // 1. Load Data Profil Saat Ini
  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth'); return; }
      setUser(user);

      // Ambil data profil dari tabel 'profiles'
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setCompanyName(data.company_name || '');
        setCompanyAddress(data.company_address || '');
        setLogoUrl(data.logo_url || '');
      }
      setLoading(false);
    };

    getProfile();
  }, [router]);

  // 2. Fungsi Upload Logo ke Storage
  const uploadLogo = async (event: any) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Pilih gambar dulu!');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload ke Bucket 'logos'
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Ambil Public URL
      const { data } = supabase.storage.from('logos').getPublicUrl(filePath);
      
      setLogoUrl(data.publicUrl); // Update preview di layar
      
    } catch (error: any) {
      alert('Gagal upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // 3. Simpan Profil ke Database
  const saveProfile = async () => {
    try {
      setSaving(true);
      
      // Kita pakai UPSERT (Update jika ada, Insert jika belum ada)
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        company_name: companyName,
        company_address: companyAddress,
        logo_url: logoUrl,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      alert('Profil Perusahaan berhasil disimpan!');
      router.push('/dashboard'); // Kembali ke dashboard
      
    } catch (error: any) {
      alert('Gagal menyimpan: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Memuat Profil...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white">
          <Link href="/dashboard" className="inline-flex items-center text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Profil Perusahaan</h1>
              <p className="text-slate-400 text-sm">Atur Kop Surat & Logo (White Label)</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          
          {/* Upload Logo Area */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Logo Perusahaan</label>
            <div className="flex items-center gap-4">
              {/* Preview Image */}
              <div className="w-20 h-20 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-300" />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div>
                <label className="cursor-pointer bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
                  <UploadCloud className="w-4 h-4" />
                  {uploading ? 'Mengupload...' : 'Pilih Gambar'}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={uploadLogo} 
                    disabled={uploading}
                    className="hidden" 
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-2">Format: JPG/PNG. Max 2MB.</p>
              </div>
            </div>
          </div>

          {/* Nama Perusahaan */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Perusahaan (PT/CV)</label>
            <input 
              type="text" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Contoh: PT. Konstruksi Maju Jaya"
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Alamat Kantor</label>
            <textarea 
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              placeholder="Jl. Jendral Sudirman No. 1..."
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none h-24 resize-none"
            />
          </div>

          <button 
            onClick={saveProfile}
            disabled={saving}
            className="w-full bg-slate-900 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {saving ? 'Menyimpan...' : <><Save className="w-4 h-4" /> Simpan Pengaturan</>}
          </button>

        </div>
      </div>
    </div>
  );
}