"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  LogOut, 
  UserCircle, 
  Receipt, 
  ChevronDown,
  Info,
  Loader2
} from "lucide-react";
import Link from "next/link";

interface Court {
  _id: string;
  name: string;
  type: string;
  pricePerHour: number;
  description: string; // Deskripsi tetap ada di interface dari backend, tapi tidak kita render
}

export default function HomePage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchCourts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courts");
        setCourts(res.data);
      } catch (error) {
        console.error("Gagal mengambil data", error);
      }
    };
    fetchCourts();
  }, []);

  const handleBookingClick = (courtId: string) => {
    if (!isLoggedIn) router.push("/login");
    else router.push(`/book/${courtId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div 
      className="min-h-screen font-sans relative bg-cover bg-center bg-fixed text-white flex flex-col"
      style={{ backgroundImage: "url('/padel-bg.jpg')" }}
    >
      {/* OVERLAY GELAP AGAR TEKS TERBACA */}
      <div className="absolute inset-0 bg-[#0B1120]/60 z-0"></div>

      {/* --- NAVBAR GLASSMORPHISM --- */}
      <nav className="px-6 py-4 flex justify-between items-center sticky top-0 z-50 bg-[#0B1120]/40 backdrop-blur-md border-b border-white/10 relative">
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 drop-shadow-lg relative z-10">
          <span>🎾</span> Padel Hub
        </h1>
        
        <div className="relative z-10">
          {isLoggedIn ? (
            <div>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition border border-white/10 backdrop-blur-sm"
              >
                <UserCircle size={22} />
                <span className="text-sm font-semibold hidden md:block">Akun Saya</span>
                <ChevronDown size={16} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 py-2 z-50 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-2 border-b border-white/10 mb-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Menu Utama</p>
                  </div>
                  <Link href="/my-bookings" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-white/5 transition">
                    <Receipt size={18} /> Riwayat Booking
                  </Link>
                  <Link href="/help" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-white/5 transition">
                    <Info size={18} /> Pusat Bantuan
                  </Link>
                  <div className="border-t border-white/10 mt-1 pt-1">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition font-medium text-left">
                      <LogOut size={18} /> Keluar (Logout)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-500 transition font-bold shadow-lg shadow-blue-500/30 text-sm">
              <UserCircle size={18} /> Masuk
            </Link>
          )}
        </div>
      </nav>

      {isMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>}

      {/* --- HERO SECTION --- */}
      <div className="max-w-6xl mx-auto w-full px-6 pt-16 pb-20 relative z-10 flex-grow">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight drop-shadow-xl text-white">
            Sewa Lapangan Padel Terbaik
          </h2>
          <p className="text-slate-200 text-lg max-w-2xl mx-auto mb-8 drop-shadow-md">
            Temukan 5 lapangan Indoor dan 4 lapangan Outdoor berkualitas internasional. 
            Pesan sekarang sebelum jadwal penuh!
          </p>

          {/* BADGES */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full font-semibold text-sm border border-white/20 shadow-lg backdrop-blur-md">
              <div className="text-blue-400">
                <MapPin size={20} />
              </div>
              <span>Cibarusah, Kab. Bekasi</span>
            </div>
            
            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full font-semibold text-sm border border-white/20 shadow-lg backdrop-blur-md">
              <div className="text-orange-400">
                <Clock size={20} />
              </div>
              <span>Buka: 07:00 - 23:59 WIB</span>
            </div>
          </div>
        </div>

        {/* --- GRID KATALOG LAPANGAN --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courts.map((court) => {
            
            // --- LOGIKA PENENTUAN GAMBAR ---
            const courtImageUrl = court.type === 'Indoor'
                ? '/images/court-indoor.jpg' 
                : '/images/court-outdoor.jpg'; 

            return (
              <div 
                key={court._id} 
                className="bg-[#0B1120]/70 rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden hover:border-white/30 hover:-translate-y-1 transition duration-300 flex flex-col backdrop-blur-lg"
              >
                {/* Visual Atas Kartu */}
                <div 
                  className="h-48 relative border-b border-white/5 overflow-hidden rounded-t-[2rem] bg-cover bg-center"
                  style={{ backgroundImage: `url(${courtImageUrl})` }}
                >
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border z-10 ${
                    court.type === 'Indoor' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 shadow-lg shadow-blue-500/20' : 'bg-orange-500/20 text-orange-300 border-orange-500/30 shadow-lg shadow-orange-500/20'
                  }`}>
                    {court.type}
                  </div>

                  <div className="absolute bottom-4 left-4 text-xs font-bold text-white/70 drop-shadow-sm flex items-center gap-1 z-10 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
                      <span>🎾</span> Padel Hub
                  </div>
                </div>

                {/* --- DETAIL KARTU TANPA DESKRIPSI --- */}
                <div className="p-6 flex flex-col relative z-10">
                  
                  {/* Judul: Margin bawah disesuaikan agar pas dengan kotak harga */}
                  <h3 className="text-xl font-bold tracking-tight text-white mb-4">{court.name}</h3>
                  
                  {/* Area Harga: Padding lebih compact */}
                  <div className="flex justify-between items-center p-3 px-4 bg-white/5 rounded-2xl mb-5 border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Harga Sewa</span>
                      <span className="text-white font-extrabold text-lg">
                        Rp {court.pricePerHour.toLocaleString('id-ID')}
                        <span className="text-slate-400 text-[10px] font-bold uppercase ml-1">/ Jam</span>
                      </span>
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                      <DollarSign className="text-green-400" size={18} />
                    </div>
                  </div>

                  {/* Tombol Pilih Jadwal */}
                  <button 
                    onClick={() => handleBookingClick(court._id)}
                    className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group text-sm uppercase tracking-widest mt-auto"
                  >
                    Pilih Jadwal
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {courts.length === 0 && (
          <div className="text-center py-20 relative z-10">
            <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={40} />
            <p className="text-slate-300 font-medium">Memuat data lapangan...</p>
          </div>
        )}
      </div>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/10 py-8 bg-[#0B1120]/60 backdrop-blur-md mt-auto relative z-10 w-full">
        <div className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest drop-shadow-sm">
          &copy; 2026 Padel Hub Cibarusah. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}