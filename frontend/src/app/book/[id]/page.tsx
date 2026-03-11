"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { 
  Calendar as CalendarIcon, 
  ArrowLeft, 
  AlertCircle,
  CheckCircle, // Ikon baru untuk sukses
  Loader2,
  ChevronRight,
  ChevronLeft,
  Info
} from "lucide-react";
import Link from "next/link";

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const courtId = params.id;
  
  const dateInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [court, setCourt] = useState<any>(null);
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [duration, setDuration] = useState(60); 
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(""); // State baru untuk pesan sukses

  const dateList = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const timeSlots = [
    "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", 
    "19:00", "20:00", "21:00", "22:00", "23:00"
  ];

  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      try {
        setIsFetching(true);
        const [resCourts, resBookings] = await Promise.all([
          axios.get("http://localhost:5000/api/courts"),
          axios.get("http://localhost:5000/api/bookings", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        const selectedCourt = resCourts.data.find((c: any) => c._id === courtId);
        if (selectedCourt) setCourt(selectedCourt);
        setExistingBookings(resBookings.data);
      } catch (err: any) {
        console.error("Fetch Error:", err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [courtId, router]);

  const isSlotBooked = (slotTime: string) => {
    const dateStr = selectedDate.toLocaleDateString('en-CA'); 
    const slotMinutes = timeToMinutes(slotTime);
    const slotEndMinutes = slotMinutes + duration;

    const closingTimeMinutes = 24 * 60; 
    if (slotEndMinutes > closingTimeMinutes) return true; 

    return existingBookings.some(b => {
      if (b.court?._id !== courtId || new Date(b.date).toLocaleDateString('en-CA') !== dateStr) return false;
      
      const bookingStart = timeToMinutes(b.startTime);
      const bookingEnd = timeToMinutes(b.endTime);

      const isInsideExisting = slotMinutes >= bookingStart && slotMinutes < bookingEnd;
      const willOverlapNext = slotMinutes < bookingStart && slotEndMinutes > bookingStart;

      return isInsideExisting || willOverlapNext;
    });
  };

  const handleBooking = async () => {
    if (!selectedSlot || !court) return;
    setIsLoading(true);
    setError(""); 
    setSuccessMsg(""); // Reset pesan
    
    try {
      const token = localStorage.getItem("token");
      const startMinutes = timeToMinutes(selectedSlot);
      const endMinutes = startMinutes + duration;
      const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

      await axios.post(
        "http://localhost:5000/api/bookings",
        { 
          court: courtId, 
          date: selectedDate.toLocaleDateString('en-CA'), 
          startTime: selectedSlot, 
          endTime, 
          totalPrice: (court.pricePerHour * duration) / 60 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // ALERT DIHAPUS, GANTI DENGAN NOTIFIKASI ELEGAN
      setSuccessMsg("Booking Berhasil! Mengalihkan ke riwayat...");
      
      // Redirect otomatis setelah 1.5 detik
      setTimeout(() => {
        router.push("/my-bookings");
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat memproses booking.");
      setIsLoading(false); // Matikan loading hanya jika error
    }
  };

  const scrollLeft = () => scrollContainerRef.current?.scrollBy({ left: -250, behavior: 'smooth' });
  const scrollRight = () => scrollContainerRef.current?.scrollBy({ left: 250, behavior: 'smooth' });

  const hasBookingsOnSelectedDate = timeSlots.some(time => isSlotBooked(time));

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
      <div className="absolute inset-0 bg-[#0B1120]/75 z-0 backdrop-blur-sm"></div>

      <div className="relative z-10 pt-10 pb-16 px-8 border-b border-white/5 bg-gradient-to-b from-[#0B1120]/80 to-transparent">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-sm transition-all duration-300 mb-6 text-sm font-bold w-fit group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            Kembali ke Katalog
          </Link>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight drop-shadow-lg">{court?.name}</h1>
          <p className="text-blue-400 font-bold tracking-[0.2em] text-xs mt-2 uppercase">Reservasi Lapangan</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-6 -mt-8 relative z-10 flex-grow pb-20">
        <div className="bg-[#0B1120]/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-black/50 border border-white/10 p-8 md:p-12">
          
          <div className="mb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="text-lg font-bold text-white tracking-wide">Pilih Tanggal</h3>
              <div className="flex items-center gap-2">
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                  <button onClick={scrollLeft} className="p-2 text-slate-300 hover:bg-white/10 hover:text-white rounded-lg transition"><ChevronLeft size={20} /></button>
                  <button onClick={scrollRight} className="p-2 text-slate-300 hover:bg-white/10 hover:text-white rounded-lg transition"><ChevronRight size={20} /></button>
                </div>
                <div className="w-px h-8 bg-white/10 mx-2"></div>
                <div className="relative">
                  <input type="date" ref={dateInputRef} className="absolute invisible" onChange={(e) => { if(e.target.value) { setSelectedDate(new Date(e.target.value)); setSelectedSlot(null); } }}/>
                  <button onClick={() => dateInputRef.current?.showPicker()} className="flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl text-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition shadow-sm">
                    <CalendarIcon size={18} /> <span className="text-sm font-bold">Lainnya</span>
                  </button>
                </div>
              </div>
            </div>

            <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth">
              {dateList.map((d, i) => {
                const isActive = d.toDateString() === selectedDate.toDateString();
                return (
                  <button key={i} onClick={() => { setSelectedDate(d); setSelectedSlot(null); }} 
                    className={`flex-shrink-0 w-24 py-5 rounded-3xl flex flex-col items-center transition-all border-2 backdrop-blur-md ${
                      isActive 
                      ? 'bg-blue-600/90 border-blue-400 text-white shadow-lg shadow-blue-500/30 transform -translate-y-1' 
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wider mb-1">{d.toLocaleDateString('id-ID', { weekday: 'short' })}</span>
                    <span className="text-2xl font-black">{d.getDate()}</span>
                    <span className="text-[11px] font-semibold opacity-70 mt-1">{d.toLocaleDateString('id-ID', { month: 'short' })}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-bold text-white mb-4 tracking-wide">Durasi Main</h3>
            <div className="flex flex-wrap gap-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl w-fit">
              {[60, 120, 180, 240].map((m) => (
                <button
                  key={m}
                  onClick={() => { setDuration(m); setSelectedSlot(null); }}
                  className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                    duration === m ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {m / 60} Jam
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
              <Info size={14} className="text-blue-400" /> Mengubah durasi dapat mempengaruhi ketersediaan jam di bawah.
            </p>
          </div>

          <div className="mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
              <h3 className="text-lg font-bold text-white tracking-wide">Jam Tersedia</h3>
              
              {hasBookingsOnSelectedDate && (
                <div className="flex items-center gap-2 bg-red-500/10 text-red-300 px-4 py-2 rounded-lg text-xs font-semibold border border-red-500/20 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-red-400 block animate-pulse"></span>
                  Jam redup sudah dibooking / bentrok waktu tutup.
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {timeSlots.map((time) => {
                const booked = isSlotBooked(time);
                const isActive = selectedSlot === time;

                return (
                  <button
                    key={time}
                    disabled={booked}
                    onClick={() => setSelectedSlot(time)}
                    className={`py-4 rounded-2xl font-bold text-base transition-all border-2 relative backdrop-blur-sm ${
                      booked 
                        ? 'bg-white/5 border-transparent text-slate-500 cursor-not-allowed line-through decoration-slate-500/50 opacity-50' 
                        : isActive 
                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30' 
                        : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 hover:border-white/30'
                    }`}
                  >
                    {time}
                    {booked && (
                      <span className="absolute -top-2 -right-2 bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm border border-white/5">
                        Full
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pembayaran</p>
              <h2 className="text-4xl font-black text-white">
                Rp {court ? ((court.pricePerHour * duration) / 60).toLocaleString('id-ID') : '0'}
              </h2>
            </div>

            <button
              onClick={handleBooking}
              disabled={!selectedSlot || isLoading}
              className="w-full md:w-auto px-16 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-30 disabled:hover:bg-blue-600 disabled:shadow-none flex items-center justify-center gap-3 group border border-blue-400/50"
            >
              {isLoading ? "Memproses..." : "Konfirmasi Booking"}
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* AREA NOTIFIKASI ERROR / SUKSES */}
          {error && (
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl flex items-center gap-3 text-sm font-bold animate-pulse backdrop-blur-md">
              <AlertCircle size={20} /> {error}
            </div>
          )}
          {successMsg && (
            <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-bottom-2 backdrop-blur-md">
              <CheckCircle size={20} /> {successMsg}
            </div>
          )}

        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}