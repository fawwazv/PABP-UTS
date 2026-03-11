"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
      
      // MENGHAPUS ALERT, GANTI DENGAN NOTIFIKASI IN-APP
      setSuccessMsg("Pendaftaran berhasil! Mengalihkan ke halaman login...");
      
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || "Pendaftaran gagal. Silakan coba lagi.");
      setIsLoading(false); // Hanya matikan loading jika error
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-6 relative font-sans text-white"
      style={{ backgroundImage: "url('/padel-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-[#0B1120]/80 z-0 backdrop-blur-sm"></div>

      <div className="w-full max-w-md bg-[#0B1120]/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/10 p-10 relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20 mb-6 shadow-lg backdrop-blur-md">
          <span className="text-3xl drop-shadow-md">🎾</span>
        </div>
        
        <h2 className="text-3xl font-black mb-2 tracking-tight text-white drop-shadow-md">Buat Akun</h2>
        <p className="text-slate-400 text-sm mb-8 text-center">Bergabung dengan Padel Hub hari ini.</p>

        {/* NOTIFIKASI */}
        {error && (
          <div className="w-full mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl flex items-center gap-3 text-sm font-bold animate-pulse">
            <AlertCircle size={18} /> {error}
          </div>
        )}
        {successMsg && (
          <div className="w-full mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in zoom-in">
            <CheckCircle size={18} /> {successMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="w-full flex flex-col gap-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" placeholder="Nama Lengkap" 
              className="w-full bg-white/5 border border-white/10 text-white px-12 py-4 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white/10 transition placeholder-slate-500"
              value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="email" placeholder="Email Address" 
              className="w-full bg-white/5 border border-white/10 text-white px-12 py-4 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white/10 transition placeholder-slate-500"
              value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="password" placeholder="Password" 
              className="w-full bg-white/5 border border-white/10 text-white px-12 py-4 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white/10 transition placeholder-slate-500"
              value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-4 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group text-sm uppercase tracking-widest disabled:opacity-50 border border-blue-400/50"
          >
            {isLoading && !successMsg ? "Memproses..." : successMsg ? "Berhasil!" : "Daftar"}
            {!isLoading && !successMsg && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="mt-8 text-slate-400 text-sm">
          Sudah punya akun? <Link href="/login" className="text-blue-400 font-bold hover:text-blue-300 transition border-b border-transparent hover:border-blue-300">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}