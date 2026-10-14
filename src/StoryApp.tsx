import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, Volume2, VolumeX } from 'lucide-react';
import RSVPForm from './RSVPForm'; // We'll extract RSVPForm
import WishesForm from './WishesForm';

function SectionBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <img
        src="/background.jpeg"
        alt="Background"
        className="w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/60" />
    </div>
  );
}

export default function StoryApp() {
  const [invitationOpened, setInvitationOpened] = useState(false);
  const [introPlayed, setIntroPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const playIntroVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.play().catch(() => undefined);
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const weddingDate = new Date('2026-12-04T10:11:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (invitationOpened) {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
      if (videoRef.current) {
        playIntroVideo();
      }
    }
  }, [invitationOpened]);



  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Read personalized guest link params
  const urlParams = new URLSearchParams(window.location.search);
  const guestPrefix = urlParams.get('prefix') || '';
  const guestName = urlParams.get('guest') || '';
  const tableNumber = urlParams.get('table') || '';

  return (
    <>
      <AnimatePresence>
        {!invitationOpened && (
          <motion.div
            key="invitation-opened"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
            className="fixed inset-0 z-[200] bg-[#FAFAFA] flex flex-col items-center justify-center"
          >
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img
                src="/background.jpeg"
                alt="Background"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/80" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="z-10 flex flex-col items-center gap-8"
            >
              <h1 className="text-center px-4 leading-[1.1] drop-shadow-sm">
                <span className="serif italic text-6xl sm:text-[6.5rem] text-[#2C2C2C] font-medium">Sanka</span>
                <br />
                <span className="serif italic text-4xl sm:text-5xl text-[#8B7355] inline-block py-2">&amp;</span>
                <br />
                <span className="serif italic text-6xl sm:text-[6.5rem] text-[#2C2C2C] font-medium">Lakmi</span>
              </h1>
              <p className="text-sm uppercase tracking-[0.3em] text-[#2C2C2C] font-medium text-center">
                Wedding Invitation
              </p>

              <button
                onClick={() => setInvitationOpened(true)}
                className="mt-8 px-8 py-3 bg-[#3D2B1F] text-white rounded-full text-sm uppercase tracking-widest hover:bg-[#8B7355] transition-colors duration-300 shadow-lg shadow-black/10"
              >
                View Invitation
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {invitationOpened && !introPlayed && (
          <motion.div
            key="intro-video"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            className="fixed inset-0 z-[100] h-[100dvh] w-[100vw] overflow-hidden bg-black"
          >
            <video
              ref={(el) => {
                if (el) {
                  el.defaultMuted = true;
                  el.muted = true;
                }
                videoRef.current = el;
              }}
              src="/gemini_generated_video_c597e460.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              controls={false}
              onLoadedMetadata={playIntroVideo}
              onCanPlay={playIntroVideo}
              onEnded={() => setIntroPlayed(true)}
              className="absolute inset-0 block h-full w-full object-cover pointer-events-none"
            />

            <button
              onClick={() => setIntroPlayed(true)}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/40 backdrop-blur-md text-white/90 rounded-full border border-white/20 text-sm tracking-[0.2em] uppercase transition-all hover:bg-white/20 z-10 whitespace-nowrap"
            >
              Skip Intro
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="snap-container no-scrollbar bg-paper relative text-[#3D2B1F] font-sans">



        {/* --- SCREEN 1: Invite Details --- */}
        <section className="snap-section relative z-10 overflow-hidden bg-transparent">
          <SectionBackground />
          <div className="absolute inset-0 overflow-visible flex flex-col items-center p-6 text-center">
            <div className="w-full my-auto flex flex-col items-center justify-center py-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="w-full max-w-sm flex flex-col items-center justify-center text-[#3D2B1F]"
              >


                {guestName ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mb-6 flex flex-col items-center"
                  >
                    <p className="text-[12px] sm:text-sm uppercase tracking-[0.2em] font-bold text-[#8B7355] mb-4">
                      WE CORDIALLY INVITE
                    </p>
                    <p className="script text-2xl sm:text-4xl text-[#3D2B1F] drop-shadow-sm mb-4 text-center px-4">
                      {guestPrefix ? `${guestPrefix} ${guestName}` : guestName}
                    </p>
                    {tableNumber && (
                      <div className="bg-[#8B7355]/10 border border-[#8B7355]/20 px-4 py-1.5 rounded-full mb-4 inline-block">
                        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold text-[#8B7355]">
                          TABLE {tableNumber}
                        </p>
                      </div>
                    )}
                    <div className="h-px w-16 bg-[#3D2B1F]/50 mb-6"></div>
                    <p className="text-[12px] sm:text-sm uppercase tracking-[0.2em] font-medium text-[#2C2C2C] mb-2 sm:mb-4">
                      TO CELEBRATE OUR
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <p className="text-[12px] sm:text-sm uppercase tracking-[0.2em] font-medium text-[#2C2C2C] mb-1">
                      INVITE YOU TO CELEBRATE
                    </p>
                    <p className="text-[12px] sm:text-sm uppercase tracking-[0.2em] font-medium text-[#2C2C2C] mb-2 sm:mb-4">
                      OUR
                    </p>
                  </>
                )}

                <h1 className="script text-6xl sm:text-[7rem] text-[#2C2C2C] mb-8 sm:mb-12 drop-shadow-sm font-normal">
                  Wedding
                </h1>

                <div className="flex flex-col items-center w-full mb-8 sm:mb-10">
                  <p className="text-[18px] sm:text-[22px] uppercase tracking-widest text-[#2C2C2C] font-bold mb-2">DECEMBER</p>
                  <div className="flex items-center justify-center w-full gap-4">
                    <div className="flex-1 text-right border-y border-[#2C2C2C]/30 py-2">
                      <p className="text-[14px] sm:text-[16px] uppercase tracking-widest text-[#2C2C2C] font-bold">FRIDAY</p>
                    </div>
                    <p className="serif text-[5.5rem] sm:text-[7rem] font-medium text-[#2C2C2C] leading-none px-1">04</p>
                    <div className="flex-1 text-left border-y border-[#2C2C2C]/30 py-2">
                      <p className="text-[14px] sm:text-[16px] uppercase tracking-widest text-[#2C2C2C] font-bold">AT 10:11 AM</p>
                    </div>
                  </div>
                  <p className="text-[18px] sm:text-[22px] uppercase tracking-widest text-[#2C2C2C] font-bold mt-2">2026</p>
                </div>

                <a
                  href="https://maps.app.goo.gl/mnKjq38cQzqzXDAFA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="space-y-2 mt-2 sm:mt-4 text-[#2C2C2C] hover:opacity-70 transition-opacity block"
                >
                  <p className="text-[16px] sm:text-[18px] uppercase tracking-widest font-bold flex items-center justify-center gap-1.5">
                    <MapPin size={14} className="text-[#8B7355]" />
                    LAVENRO GARDEN HOTEL
                  </p>
                  <p className="text-[14px] sm:text-[16px] uppercase tracking-[0.15em] font-medium">KOSGAMA</p>
                </a>

                <div className="mt-8 sm:mt-10">
                  <p className="text-[12px] sm:text-sm uppercase tracking-[0.15em] font-bold text-[#2C2C2C]">RECEPTION TO FOLLOW</p>
                </div>

                <div className="mt-4 sm:mt-6 flex justify-center">
                  <svg className="w-10 h-10 text-[#2C2C2C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 12c-1.5-1-2-2-2-4v-4l6-2v6c0 2-.5 3-2 4M9 12c1.5-1 2-2 2-4v-4l-6-2v6c0 2 .5 3 2 4M13 12v8M11 12v8M9 20h6" />
                    <circle cx="15.5" cy="5.5" r="0.5" fill="currentColor" />
                    <circle cx="14" cy="7.5" r="0.5" fill="currentColor" />
                    <circle cx="8.5" cy="5.5" r="0.5" fill="currentColor" />
                    <circle cx="10" cy="7.5" r="0.5" fill="currentColor" />
                  </svg>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- SCREEN 1.5: Parents --- */}
        <section className="snap-section relative z-10 overflow-hidden">
          <SectionBackground />
          <div className="absolute inset-0 overflow-visible flex flex-col items-center p-6 text-center">
            <div className="w-full my-auto flex flex-col items-center justify-center py-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="bg-white p-10 pt-16 rounded-t-[10rem] rounded-b-[2rem] border border-[#EAE1D3] w-full max-w-sm flex flex-col items-center shadow-xl relative overflow-hidden"
              >
                {/* Subtle texture overlay on the card */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-30 pointer-events-none mix-blend-overlay" />

                <div className="relative z-10 w-full flex flex-col items-center text-center">
                  <h2 className="cursive text-5xl sm:text-6xl text-[#C8B29E] mb-3 mt-2">Together with</h2>
                  <h3 className="serif text-[13px] uppercase tracking-[0.3em] text-[#3D2B1F] mb-10 font-bold">Our Families</h3>

                  <div className="flex flex-col items-center w-full mb-8">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 mb-3 font-bold">Groom's Parents</p>
                    <p className="serif text-xl text-[#2C2C2C] leading-relaxed text-center">Mr. H. B. K. Gunapala<br/>&amp; Mrs. H. G. Bandu</p>
                  </div>

                  {/* Elegant Divider */}
                  <div className="flex items-center justify-center gap-3 w-3/4 mx-auto mb-8">
                    <div className="h-px bg-[#EAE1D3] flex-1"></div>
                    <div className="w-1.5 h-1.5 rotate-45 bg-[#C8B29E]"></div>
                    <div className="h-px bg-[#EAE1D3] flex-1"></div>
                  </div>

                  <div className="flex flex-col items-center w-full">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 mb-3 font-bold">Bride's Parents</p>
                    <p className="serif text-xl text-[#2C2C2C] leading-relaxed text-center">Mr. T. G. Weerasinghe<br/>&amp; Mrs. G. B. S. Rajapaksha</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- SCREEN 1.75: Countdown --- */}
        <section className="snap-section relative z-10 overflow-hidden">
          <SectionBackground />
          <div className="absolute inset-0 overflow-visible flex flex-col items-center p-6 text-center">
            <div className="w-full my-auto flex flex-col items-center justify-center py-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="bg-white p-10 pt-16 rounded-t-[10rem] rounded-b-[2rem] border border-[#EAE1D3] w-full max-w-sm flex flex-col items-center shadow-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-30 pointer-events-none mix-blend-overlay" />

                <div className="relative z-10 w-full flex flex-col items-center text-center">
                  <h2 className="cursive text-5xl sm:text-6xl text-[#C8B29E] mb-3 mt-2">Forever Begins In</h2>
                  <h3 className="serif text-[13px] uppercase tracking-[0.3em] text-[#3D2B1F] mb-10 font-bold">A Grace-filled occasion</h3>

                  <div className="flex flex-row items-center justify-center gap-6 w-full mb-8">
                    <div className="flex flex-col items-center">
                      <p className="serif text-5xl text-[#2C2C2C] leading-none mb-2">{timeLeft.days}</p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Days</p>
                    </div>
                    <div className="text-4xl text-[#C8B29E] font-light -mt-4">:</div>
                    <div className="flex flex-col items-center">
                      <p className="serif text-5xl text-[#2C2C2C] leading-none mb-2">{timeLeft.hours}</p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Hours</p>
                    </div>
                  </div>

                  {/* Elegant Divider */}
                  <div className="flex items-center justify-center gap-3 w-3/4 mx-auto mb-8">
                    <div className="h-px bg-[#EAE1D3] flex-1"></div>
                    <div className="w-1.5 h-1.5 rotate-45 bg-[#C8B29E]"></div>
                    <div className="h-px bg-[#EAE1D3] flex-1"></div>
                  </div>

                  <div className="flex flex-row items-center justify-center gap-6 w-full">
                    <div className="flex flex-col items-center">
                      <p className="serif text-5xl text-[#2C2C2C] leading-none mb-2">{timeLeft.minutes}</p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Mins</p>
                    </div>
                    <div className="text-4xl text-[#C8B29E] font-light -mt-4">:</div>
                    <div className="flex flex-col items-center">
                      <p className="serif text-5xl text-[#2C2C2C] leading-none mb-2">{timeLeft.seconds}</p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Secs</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>







        {/* --- SCREEN 4: Timeline --- */}
        <section className="snap-section relative z-10 overflow-hidden">
          <SectionBackground />
          <div className="absolute inset-0 overflow-visible flex flex-col items-center p-6 text-center">
            <div className="w-full my-auto flex flex-col items-center justify-center py-10">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="bg-white/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/60 w-full max-w-sm flex flex-col items-center shadow-lg py-12"
              >
                <h2 className="serif text-4xl tracking-[0.2em] text-[#3D2B1F] font-medium uppercase mb-2">
                  Wedding
                </h2>
                <h3 className="script text-3xl sm:text-5xl text-[#8B7355] mb-10">
                  Timeline
                </h3>

                <div className="flex flex-col gap-6 w-full relative">
                  {/* Timeline line */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-300 -translate-x-1/2" />

                  {([
                    { time: "9:30 AM", title: "GUEST ARRIVAL" },
                    { time: "10:11 AM", title: "PORUWA CEREMONY" },
                    { time: "12:30 PM", title: "LUNCH BUFFET & RECEPTION" },
                    { time: "4:00 PM", title: "GOING AWAY" },
                  ] as { time: string; title: string; sub?: string }[]).map((item, idx) => (
                    <div key={idx} className="relative z-10 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white shadow-sm w-[85%] mx-auto">
                      <p className="text-[13px] font-bold text-[#8B7355] mb-1">{item.time}</p>
                      <p className="text-[12px] uppercase tracking-widest text-[#3D2B1F] font-semibold">{item.title}</p>
                      {item.sub && <p className="serif text-[12px] italic text-zinc-500 mt-1">{item.sub}</p>}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- SCREEN 5: The Details --- */}
        <section className="snap-section relative z-10 overflow-hidden">
          <SectionBackground />
          <div className="absolute inset-0 overflow-visible flex flex-col items-center p-6 text-center">
            <div className="w-full my-auto flex flex-col items-center justify-center py-10">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="w-full max-w-sm flex flex-col gap-4"
              >
                <div className="bg-[#FAF7F2] p-8 rounded-[2rem] shadow-md border border-white">
                  <h3 className="script text-2xl sm:text-4xl text-[#8B7355] mb-1">the</h3>
                  <h2 className="serif text-4xl tracking-[0.2em] text-[#3D2B1F] font-medium uppercase mb-6">Details</h2>

                  <div className="w-full h-32 rounded-xl overflow-hidden mb-4 relative">
                    <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=900&auto=format&fit=crop" className="w-full h-full object-cover" alt="Venue" referrerPolicy="no-referrer" />
                  </div>

                  <div className="bg-[#EAE1D3] py-2 rounded-t-xl mb-1">
                    <p className="text-[12px] uppercase tracking-[0.2em] font-bold text-[#8B7355]">Location</p>
                  </div>
                  <div className="bg-white py-4 rounded-b-xl shadow-sm border border-white mb-4 flex flex-col items-center">
                    <p className="text-[12px] uppercase font-bold text-[#3D2B1F]">Lavenro Garden Hotel</p>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1 mb-3">Kosgama</p>
                    <a
                      href="https://maps.app.goo.gl/mnKjq38cQzqzXDAFA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#EAE1D3] text-[#3D2B1F] rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#C8B29E] transition-colors"
                    >
                      <MapPin size={10} />
                      Live Location
                    </a>
                  </div>

                  <div className="bg-[#EAE1D3] py-2 rounded-t-xl mb-1">
                    <p className="text-[12px] uppercase tracking-[0.2em] font-bold text-[#8B7355]">Dress Code</p>
                  </div>
                  <div className="bg-white py-4 px-2 rounded-b-xl shadow-sm border border-white flex flex-col items-center">
                    <p className="serif text-[12px] italic text-zinc-500 mb-3">Kindly dress in our wedding colours</p>
                    <div className="flex justify-center gap-4">
                      {[
                        { name: "White", color: "#FFFFFF" },
                        { name: "Black", color: "#1A1A1A" },
                        { name: "Ash", color: "#B2B2B2" },
                        { name: "Gold", color: "linear-gradient(135deg, #E6C77A 0%, #C9A24D 50%, #A8832F 100%)" },
                      ].map((c) => (
                        <div key={c.name} className="flex flex-col items-center gap-1.5">
                          <span
                            className="w-9 h-9 rounded-full border border-zinc-300 shadow-sm"
                            style={{ background: c.color }}
                          />
                          <p className="text-[10px] uppercase tracking-widest font-semibold text-[#3D2B1F]">{c.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- SCREEN 6: Gallery --- */}
        <section className="snap-section relative z-10 overflow-hidden">
          <SectionBackground />
          <div className="absolute inset-0 overflow-visible flex flex-col items-center p-6 text-center">
            <div className="w-full my-auto flex flex-col items-center justify-center py-10">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="w-full max-w-sm flex flex-col items-center"
              >
                <div className="flex items-center justify-center gap-3 w-[60%] mx-auto mb-6">
                  <div className="h-px bg-[#3D2B1F]/30 flex-1"></div>
                  <p className="serif text-[13px] uppercase tracking-[0.2em] font-medium text-[#2C2C2C]">GALLERY</p>
                  <div className="h-px bg-[#3D2B1F]/30 flex-1"></div>
                </div>

                <div className="w-[120vw] overflow-hidden -mx-10 py-2">
                  <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="flex w-max gap-3 px-2"
                  >
                    {[1, 2, 3, 4, 1, 2, 3, 4].map((num, idx) => (
                      <div
                        key={idx}
                        className="w-[50vw] shrink-0 aspect-[3/4] rounded-xl overflow-hidden shadow-md border border-white/60 relative"
                      >
                        <img src={`/images/${num}.jpg`} alt={`Gallery ${num}`} className="w-full h-full object-cover pointer-events-none" loading="lazy" />
                      </div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- SCREEN 7: RSVP --- */}
        <section className="snap-section relative z-10 overflow-hidden">
          <SectionBackground />
          <div className="absolute inset-0 overflow-visible flex flex-col items-center p-6 text-center">
            <div className="w-full my-auto flex flex-col items-center justify-center py-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-[#EAE1D3] w-full max-w-sm min-h-[80vh] h-auto flex flex-col justify-center items-center shadow-xl"
              >
                <div className="flex items-center justify-center gap-3 w-[60%] mx-auto mb-10 mt-4 md:mt-0">
                  <div className="h-px bg-zinc-300 flex-1"></div>
                  <p className="serif text-[13px] uppercase tracking-[0.2em] font-medium text-[#2C2C2C]">PLEASE</p>
                  <div className="h-px bg-zinc-300 flex-1"></div>
                </div>

                <div className="relative mb-12 w-[85%] max-w-[260px]">
                  <img src="/floral_rsvp.png" alt="RSVP" className="w-full h-auto object-contain mix-blend-multiply" />
                </div>

                <p className="serif text-[13px] sm:text-[15px] uppercase tracking-[0.15em] font-bold text-[#2C2C2C] mb-6">
                  BY DECEMBER 04, 2026
                </p>

                <div className="w-full">
                  <RSVPForm />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- SCREEN 7: Wishes --- */}
        <section className="snap-section relative z-10 overflow-hidden">
          <SectionBackground />
          <div className="absolute inset-0 overflow-visible flex flex-col items-center p-6 text-center">
            <div className="w-full my-auto flex flex-col items-center justify-center py-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-[#EAE1D3] w-full max-w-sm h-auto flex flex-col justify-center items-center shadow-xl"
              >
                <div className="flex items-center justify-center gap-3 w-[60%] mx-auto mb-6 mt-4 md:mt-0">
                  <div className="h-px bg-zinc-300 flex-1"></div>
                  <p className="serif text-[13px] uppercase tracking-[0.2em] font-medium text-[#2C2C2C]">GUEST BOOK</p>
                  <div className="h-px bg-zinc-300 flex-1"></div>
                </div>

                <h3 className="script text-3xl sm:text-5xl text-[#C8B29E] mb-6">Leave a Wish</h3>

                <p className="serif text-[13px] sm:text-[15px] text-[#2C2C2C] mb-8 leading-relaxed">
                  We'd love to hear from you! Please leave your wishes, advice, or a simple hello for us.
                </p>

                <div className="w-full">
                  <WishesForm />
                </div>
              </motion.div>

              <div className="mt-10 mb-8 w-full text-center z-20 relative">
                <p className="text-[#3D2B1F] drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] text-[10px] font-sans tracking-widest uppercase leading-relaxed font-semibold">
                  Want a beautiful wedding website like this? <br />
                  Create yours with <a target="_blank" rel="noreferrer" className="text-[#8B7355] hover:text-[#3D2B1F] font-bold underline decoration-[#8B7355] underline-offset-4 transition-colors" href="https://wa.me/94707819074">invitemint</a>
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Audio and Play Button */}
      <audio
        ref={audioRef}
        src="/Teddy Swims - You're Still The One (Shania Twain Cover).mp3"
        loop
      />
      <button
        onClick={togglePlay}
        className={`fixed bottom-6 right-6 z-[60] p-3 rounded-full shadow-lg transition-all ${isPlaying ? 'bg-[#C8B29E] text-white' : 'bg-white/80 backdrop-blur-sm text-[#8B7355] border border-[#EAE1D3]'
          }`}
        aria-label="Toggle music"
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </>
  );
}
