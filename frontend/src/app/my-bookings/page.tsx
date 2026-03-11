"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, Loader2 } from "lucide-react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMyBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
            const res = await axios.get("http://localhost:5000/api/bookings/me", {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const sortedBookings = res.data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(sortedBookings);
      } catch (error) {
        console.error("Gagal mengambil riwayat booking pribadi", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchMyBookings();
  }, [router]);

  if (isFetching) return (
    <div className="min-h-screen flex justify-center items-center bg-[#0B1120]">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed text-white relative flex flex-col font-sans"
      style={{ backgroundImage: "url('/padel-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-[#0B1120]/80 z-0 backdrop-blur-sm"></div>

      <div className="relative z-10 pt-10 pb-16 px-8 border-b border-white/5 bg-gradient-to-b from-[#0B1120]/80 to-transparent">
        <div className="max-w-4xl mx-auto">
          {/* PERBAIKAN: Tombol Kembali Bergaya Kapsul Interaktif (Sama dengan detail booking) */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-sm transition-all duration-300 mb-6 text-sm font-bold w-fit group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            Kembali ke Katalog
          </Link>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight drop-shadow-lg text-white">Riwayat Booking</h1>
          <p className="text-blue-400 font-bold tracking-[0.2em] text-xs mt-2 uppercase">Tiket & Jadwal Anda</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-6 -mt-8 relative z-10 flex-grow pb-20">
        
        {bookings.length === 0 ? (
          <div className="bg-[#0B1120]/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/10 p-12 text-center flex flex-col items-center">
            <span className="text-6xl mb-4 grayscale opacity-50">🎾</span>
            <h3 className="text-2xl font-bold text-white mb-2">Belum Ada Jadwal</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">Anda belum melakukan pemesanan lapangan. Ayo mulai gaya hidup sehat Anda hari ini!</p>
            <Link href="/" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-500/20 uppercase tracking-widest text-sm border border-blue-400/50">
              Pesan Lapangan Sekarang
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {bookings.map((b, index) => (
              <div 
                key={index} 
                className="bg-[#0B1120]/60 backdrop-blur-xl rounded-[2rem] border border-white/10 p-6 md:p-8 hover:bg-white/5 transition flex flex-col md:flex-row gap-8 items-start md:items-center shadow-xl shadow-black/40"
              >
                <div className={`hidden md:flex flex-shrink-0 w-24 h-24 rounded-[1.5rem] flex-col items-center justify-center border ${
                  b.court?.type === 'Indoor' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-orange-500/10 border-orange-500/30'
                }`}>
                  <span className="text-3xl drop-shadow-md mb-1">🎾</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${
                    b.court?.type === 'Indoor' ? 'text-blue-300' : 'text-orange-300'
                  }`}>{b.court?.type}</span>
                </div>

                <div className="flex-grow w-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{b.court?.name || 'Lapangan Terhapus'}</h3>
                    <span className="md:hidden text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/10">
                      {b.court?.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-3 text-slate-300 text-sm bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">
                      <Calendar size={18} className="text-blue-400" />
                      <span className="font-semibold">{new Date(b.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300 text-sm bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">
                      <Clock size={18} className="text-orange-400" />
                      <span className="font-semibold">{b.startTime} - {b.endTime} WIB</span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 w-full md:w-auto bg-white/5 p-5 rounded-[1.5rem] border border-white/10 flex flex-col items-center md:items-end md:min-w-[200px]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><CreditCard size={12}/> Total Bayar</p>
                  <h4 className="text-2xl font-black text-white text-center md:text-right">
                    Rp {b.totalPrice.toLocaleString('id-ID')}
                  </h4>
                  <div className="mt-3 px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Lunas
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <footer className="border-t border-white/10 py-8 bg-[#0B1120]/60 backdrop-blur-md mt-auto relative z-10 w-full">
        <div className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest drop-shadow-sm">
          &copy; 2026 Padel Hub Cibarusah. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}