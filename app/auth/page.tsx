"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Terminal, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Mode Login atau Daftar
  const [msg, setMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      if (isSignUp) {
        // PROSES DAFTAR
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMsg('Akun berhasil dibuat! Silakan login.');
        setIsSignUp(false); // Pindah ke mode login
      } else {
        // PROSES LOGIN
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Jika sukses, lempar ke Dashboard Kalkulator
        router.push('/calculator');
      }
    } catch (error: any) {
      setMsg(error.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center gap-2 group">
        <div className="bg-orange-600 p-2 rounded-lg text-white group-hover:rotate-12 transition-transform">
          <Terminal className="w-6 h-6" />
        </div>
        <span className="font-bold text-xl text-slate-900">CONTECH<span className="text-orange-600">LABS</span></span>
      </Link>

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {isSignUp ? 'Daftar Akun Baru' : 'Login ke Dashboard'}
          </h1>
          <p className="text-slate-500 text-sm">
            {isSignUp 
              ? 'Mulai digitalisasi proyek Anda hari ini.' 
              : 'Akses kalkulator dan data proyek Anda.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="nama@perusahaan.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {msg && (
            <div className={`p-3 rounded-lg text-sm text-center ${msg.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              {msg}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                {isSignUp ? 'Buat Akun' : 'Masuk Sistem'} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {isSignUp ? 'Sudah punya akun? ' : 'Belum punya akun? '}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-orange-600 font-bold hover:underline"
          >
            {isSignUp ? 'Login di sini' : 'Daftar sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
}