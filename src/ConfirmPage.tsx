import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, CheckCircle2, Users, Minus, Plus, Calendar, MapPin, Clock } from 'lucide-react';

function SectionBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <img
        src="/white_roses_bg.png"
        alt="White Roses Background"
        className="w-full h-full object-cover opacity-85"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/80 via-[#FAF7F2]/60 to-[#FAF7F2]/90" />
    </div>
  );
}

export default function ConfirmPage() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Form State
  const [attendance, setAttendance] = useState<"yes" | "no">("yes");
  const [name, setName] = useState<string>("");
  const [guestCount, setGuestCount] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fullInviteUrl, setFullInviteUrl] = useState<string>("/");

  const endpoint = "https://script.google.com/macros/s/AKfycbx7KfLqJ0YcdqvFD-igqNJc4f-NfWI-tdqb5acO1dt-fDDsdWb3rOYoxCNgWkKguz5mqw/exec";

  // Pre-fill name and guest count from URL query param
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('guest');
    const prefixParam = urlParams.get('prefix');

    if (guestParam) {
      if (prefixParam && !guestParam.toLowerCase().includes(prefixParam.toLowerCase())) {
        setName(`${prefixParam} ${guestParam}`);
      } else {
        setName(guestParam);
      }
    }

    if (prefixParam && (prefixParam.includes('&') || prefixParam.toLowerCase().includes('family'))) {
      setGuestCount(2);
    }

    // Preserve guest params when linking back to full invitation
    if (guestParam || prefixParam) {
      setFullInviteUrl(`/?prefix=${encodeURIComponent(prefixParam || '')}&guest=${encodeURIComponent(guestParam || '')}`);
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Please enter your name to confirm.");
      return;
    }

    const effectiveGuestCount = attendance === "yes" ? Math.max(1, guestCount) : 0;

    const payload = {
      name: name.trim(),
      attendance,
      guestCount: effectiveGuestCount,
      count: effectiveGuestCount,
      submittedAt: new Date().toISOString(),
      source: "confirm_page",
    };

    setSubmitting(true);

    try {
      // Use text/plain with no-cors to bypass browser OPTIONS preflight checks with Google Apps Script
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
      setSuccessMessage(
        attendance === "yes"
          ? `Thank you! Your confirmation for ${effectiveGuestCount} guest(s) has been received. We can't wait to celebrate with you!`
          : `Thank you for letting us know. You will be warmly remembered!`
      );
    } catch {
      setErrorMessage("Could not submit your confirmation. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] relative text-[#3D2B1F] font-sans flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 selection:bg-[#C8B29E] selection:text-white">
      <SectionBackground />

      {/* Main Single Confirmation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg bg-white/95 backdrop-blur-md rounded-[2.5rem] border border-[#EAE1D3] shadow-2xl overflow-hidden p-6 sm:p-8 flex flex-col items-center text-center relative z-10 my-4"
      >
        {/* Subtle Top Accent Divider */}
        <div className="flex items-center justify-center gap-3 w-3/4 mx-auto mb-5">
          <div className="h-px bg-[#EAE1D3] flex-1" />
          <p className="serif text-[11px] uppercase tracking-[0.28em] font-bold text-[#8B7355]">
            ATTENDANCE CONFIRMATION
          </p>
          <div className="h-px bg-[#EAE1D3] flex-1" />
        </div>

        {/* Arched Portrait of Couple */}
        <div className="relative w-48 h-64 sm:w-56 sm:h-72 rounded-t-full rounded-b-3xl overflow-hidden border-2 border-[#EAE1D3] shadow-lg mb-5 shrink-0 mx-auto group">
          <img
            src="/4.jpg.jpeg"
            alt="Shakila & Madawa"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Couple Names */}
        <h1 className="serif text-3xl sm:text-4xl text-[#2C2C2C] font-normal leading-tight tracking-wide">
          SHAKILA <span className="script text-3xl sm:text-4xl text-[#8B7355] font-normal">&amp;</span> MADAWA
        </h1>

        {/* Personalized Greeting if Name is Available */}
        {name ? (
          <p className="script text-2xl sm:text-3xl text-[#8B7355] mt-1.5 mb-1">
            Dear {name},
          </p>
        ) : null}

        {/* Context Note (Short Confirmation Invite) */}
        <p className="serif text-[13px] sm:text-sm text-zinc-600 leading-relaxed mt-1.5 mb-4 max-w-sm">
          Having previously shared our wedding invitation, we warmly invite you to kindly confirm your attendance as we finalize arrangements for our celebration.
        </p>

        {/* Event Date & Venue Capsule */}
        <div className="w-full bg-[#FAF7F2] border border-[#EAE1D3] rounded-2xl p-3 sm:p-4 mb-3.5 text-center shadow-inner">
          <div className="flex items-center justify-center gap-2 text-[#3D2B1F] text-xs font-semibold uppercase tracking-wider mb-1">
            <Calendar size={14} className="text-[#8B7355]" />
            <span>Thursday, September 24, 2026</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-zinc-500 text-[11px] font-medium">
            <MapPin size={13} className="text-[#8B7355]" />
            <span>Heritage Grand &bull; Badulla</span>
          </div>
        </div>

        {/* English Confirmation Deadline Notice */}
        <div className="w-full bg-[#8B7355]/10 border border-[#8B7355]/20 rounded-xl py-2 px-3 mb-5 flex items-center justify-center gap-2 text-[#8B7355]">
          <Clock size={13} />
          <span className="text-[11px] uppercase tracking-wider font-bold">
            Please confirm by September 14, 2026
          </span>
        </div>

        {/* Form or Confirmation View */}
        {submitted ? (
          <div className="w-full py-6 px-4 bg-[#FAF7F2] rounded-2xl border border-[#C8B29E]/40 flex flex-col items-center text-center animate-in fade-in duration-500">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3 shadow-inner">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="serif text-2xl text-[#3D2B1F] font-bold mb-2">Confirmation Received</h2>
            <p className="serif text-base text-[#2C2C2C] leading-relaxed mb-5">
              {successMessage}
            </p>
            <div className="flex flex-col gap-2.5 w-full">
              <a
                href={fullInviteUrl}
                className="w-full py-3.5 px-4 rounded-xl bg-[#3D2B1F] text-white text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors shadow-md"
              >
                View Full Wedding Invitation
              </a>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-[11px] uppercase tracking-wider text-[#8B7355] hover:text-[#3D2B1F] font-semibold py-1 underline underline-offset-4 cursor-pointer"
              >
                Update Your Confirmation
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-4 text-left">
            {/* Attendance Selection */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] font-bold text-[#8B7355] mb-2 text-center">
                Will you be attending on Sept 24?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttendance("yes")}
                  className={`py-3.5 px-3 rounded-xl text-[12px] uppercase tracking-wider font-bold border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    attendance === "yes"
                      ? "bg-[#C8B29E] text-white border-[#C8B29E] shadow-md ring-2 ring-[#C8B29E]/30"
                      : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  <span>Yes, I will attend</span>
                  <span className="text-[10px] font-normal opacity-90">(Joyfully accept)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAttendance("no")}
                  className={`py-3.5 px-3 rounded-xl text-[12px] uppercase tracking-wider font-bold border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    attendance === "no"
                      ? "bg-zinc-700 text-white border-zinc-700 shadow-md ring-2 ring-zinc-700/30"
                      : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  <span>No, I cannot</span>
                  <span className="text-[10px] font-normal opacity-90">(Regretfully decline)</span>
                </button>
              </div>
            </div>

            {/* Guest Name Input */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] font-bold text-[#8B7355] mb-1.5">
                Guest Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base text-[#3D2B1F] font-serif outline-none focus:border-[#C8B29E] focus:ring-2 focus:ring-[#C8B29E]/30 transition-all"
                required
              />
            </div>

            {/* Guest Count Selection (When Attending) */}
            {attendance === "yes" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EAE1D3]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Users size={15} className="text-[#8B7355]" />
                    <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#8B7355]">
                      Number of Guests Attending
                    </label>
                  </div>
                  <span className="text-xs font-semibold text-zinc-500">
                    {guestCount} {guestCount === 1 ? 'Person' : 'People'}
                  </span>
                </div>

                {/* Stepper Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setGuestCount((prev) => Math.max(1, prev - 1))}
                    disabled={guestCount <= 1}
                    className="w-10 h-10 rounded-full border border-zinc-300 bg-white flex items-center justify-center text-[#3D2B1F] hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-white cursor-pointer shadow-sm transition-all"
                    aria-label="Decrease guest count"
                  >
                    <Minus size={16} />
                  </button>

                  <div className="w-16 h-12 bg-white rounded-xl border border-[#C8B29E] flex items-center justify-center text-2xl font-bold serif text-[#3D2B1F] shadow-inner">
                    {guestCount}
                  </div>

                  <button
                    type="button"
                    onClick={() => setGuestCount((prev) => Math.min(10, prev + 1))}
                    disabled={guestCount >= 10}
                    className="w-10 h-10 rounded-full border border-zinc-300 bg-white flex items-center justify-center text-[#3D2B1F] hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-white cursor-pointer shadow-sm transition-all"
                    aria-label="Increase guest count"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Quick select pills */}
                <div className="flex items-center justify-center gap-2 mt-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuestCount(num)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        guestCount === num
                          ? "bg-[#8B7355] text-white border-[#8B7355]"
                          : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {errorMessage && (
              <p className="text-xs text-red-600 font-semibold text-center bg-red-50 py-2 px-3 rounded-lg border border-red-200">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#3D2B1F] text-white py-4 rounded-xl text-xs uppercase tracking-widest font-bold shadow-md transition-all hover:bg-black disabled:opacity-60 cursor-pointer mt-3"
            >
              {submitting ? "Submitting Confirmation..." : "Submit Confirmation"}
            </button>

            {/* Link back to full invitation */}
            <div className="pt-3 text-center">
              <a
                href={fullInviteUrl}
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#8B7355] hover:text-[#3D2B1F] font-semibold transition-colors underline underline-offset-4"
              >
                <span>View Full Wedding Invitation &amp; Event Details &rarr;</span>
              </a>
            </div>
          </form>
        )}
      </motion.div>

      {/* Footer Branding */}
      <footer className="mt-2 mb-4 text-center z-10">
        <p className="text-[#3D2B1F]/70 text-[10px] uppercase tracking-widest font-semibold">
          Shakila &amp; Madawa Wedding &bull; September 24, 2026
        </p>
      </footer>

      {/* Background Audio Element & Floating Music Toggle */}
      <audio
        ref={audioRef}
        src="/Teddy Swims - You're Still The One (Shania Twain Cover).mp3"
        loop
      />
      <button
        onClick={togglePlay}
        className={`fixed bottom-6 right-6 z-[60] p-3 rounded-full shadow-lg transition-all cursor-pointer ${
          isPlaying
            ? 'bg-[#C8B29E] text-white'
            : 'bg-white/80 backdrop-blur-sm text-[#8B7355] border border-[#EAE1D3]'
        }`}
        aria-label="Toggle music"
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </div>
  );
}
