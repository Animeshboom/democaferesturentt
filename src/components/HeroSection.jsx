import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Calendar, Play, Pause, Volume2, VolumeX, Maximize2, Sparkles } from 'lucide-react';

export default function HeroSection({
  scrollProgress = 0,
  activeSceneIndex = 0,
  onExploreMenu,
  onReserveTable
}) {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasPreloaderFaded, setHasPreloaderFaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const videoRef = useRef(null);
  const heroRef = useRef(null);

  // Synchronize video timeline scrub with activeSceneIndex
  useEffect(() => {
    if (videoRef.current && Number.isFinite(videoRef.current.duration) && videoRef.current.duration > 0) {
      const targetTime = (activeSceneIndex / 10) * videoRef.current.duration;
      videoRef.current.currentTime = targetTime;
    }
  }, [activeSceneIndex]);

  // Parallax mouse movement (Desktop only, subtle & smooth)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth < 1024) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Unmount preloader cleanly after video fades in
  useEffect(() => {
    if (isVideoReady) {
      const timer = setTimeout(() => setHasPreloaderFaded(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isVideoReady]);

  // Autoplay initialization with graceful fallback
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay blocked by browser policy without gesture
            setIsPlaying(false);
          });
      }
    }
  }, []);

  // Handle Play/Pause
  const togglePlay = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Handle Audio Mute/Unmute
  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!isPlaying) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Handle Fullscreen
  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (!heroRef.current) return;
    if (!document.fullscreenElement) {
      heroRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Parallax transform styles based on mouse & scroll
  const videoTransform = `scale(${1 + scrollProgress * 0.05}) translate3d(${mousePos.x * -10}px, ${mousePos.y * -8 + scrollProgress * 35}px, 0)`;
  const contentOpacity = Math.max(0, 1 - scrollProgress * 2.2);
  const contentTransform = `translate3d(0, -${scrollProgress * 50}px, 0)`;

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full overflow-hidden"
      aria-label="Tisha Restro Cinematic Showcase"
    >
      {/* 1. PRIMARY CINEMATIC VIDEO BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Refined Cinematic Placeholder / Preloader (Fades and unmounts cleanly) */}
        {!hasPreloaderFaded && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0807] transition-opacity duration-700 ease-out"
            style={{
              opacity: isVideoReady ? 0 : 1,
              pointerEvents: 'none',
              backgroundImage: `radial-gradient(ellipse at 60% 50%, rgba(197, 155, 39, 0.12) 0%, #0a0807 70%)`
            }}
          >
            <div className="w-16 h-16 rounded-full border border-[var(--brass-500)] bg-[rgba(197,155,39,0.08)] flex items-center justify-center mb-4 animate-pulse">
              <span className="font-display font-bold text-lg text-[var(--brass-300)] tracking-widest">TR</span>
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--brass-400)] font-mono">
              Experiencing Haute Indian Gastronomy...
            </p>
          </div>
        )}

        {/* The Native MP4 Video Canvas (The visual heart of the hero) */}
        <video
          ref={videoRef}
          src="/videos/tisha-hero.mp4"
          poster="/images/hero_biryani.jpg"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          onLoadedData={() => setIsVideoReady(true)}
          onCanPlay={() => setIsVideoReady(true)}
          onPlaying={() => {
            setIsVideoReady(true);
            setIsPlaying(true);
          }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{
            transform: videoTransform,
            objectPosition: '68% center',
            filter: 'contrast(1.05) brightness(0.92) saturate(1.08)'
          }}
        />

        {/* Multi-tier Editorial Gradient Scrim for Pristine Contrast & Text Visibility */}
        {/* Desktop Asymmetric Left Shadow + Soft Vignette */}
        <div
          className="absolute inset-0 z-10 pointer-events-none hidden lg:block"
          style={{
            background: `
              linear-gradient(90deg, 
                #0a0807 0%, 
                rgba(10, 8, 7, 0.98) 28%, 
                rgba(10, 8, 7, 0.88) 42%, 
                rgba(10, 8, 7, 0.5) 60%, 
                rgba(10, 8, 7, 0.1) 76%, 
                rgba(10, 8, 7, 0.6) 100%
              ),
              linear-gradient(180deg, 
                rgba(10, 8, 7, 0.88) 0%, 
                transparent 16%, 
                transparent 78%, 
                #0a0807 100%
              ),
              radial-gradient(circle at 75% 55%, transparent 35%, rgba(10, 8, 7, 0.55) 100%)
            `
          }}
        />

        {/* Tablet & Mobile Responsive Scrim (Balanced Vertical Scrim) */}
        <div
          className="absolute inset-0 z-10 pointer-events-none lg:hidden"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(10, 8, 7, 0.96) 0%, 
                rgba(10, 8, 7, 0.88) 35%, 
                rgba(10, 8, 7, 0.55) 60%, 
                rgba(10, 8, 7, 0.85) 85%, 
                #0a0807 100%
              )
            `
          }}
        />

        {/* Subtle Warm Golden Ambient Light */}
        <div
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none blur-3xl opacity-20 z-10"
          style={{
            background: 'radial-gradient(circle, rgba(197,155,39,0.3) 0%, rgba(194,94,46,0.15) 45%, transparent 70%)'
          }}
        />
      </div>

      {/* 2. SUBTLE 3D / PARALLAX BOTANICAL & SPICE ACCENTS */}
      {/* Top-Right Floating Star Anise Accent */}
      <div
        className="hidden lg:block absolute top-28 right-16 z-20 pointer-events-none transition-transform duration-500 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 15}px, 0) rotate(${12 + mousePos.x * 8}deg)`,
          opacity: 0.75
        }}
        aria-hidden="true"
      >
        <div className="w-12 h-12 rounded-full border border-[rgba(197,155,39,0.25)] bg-[rgba(10,8,7,0.45)] backdrop-blur-sm flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-[var(--brass-300)]" />
        </div>
      </div>

      {/* 3. EDITORIAL HERO CONTENT LAYER */}
      <div
        className="section-container relative z-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        style={{
          opacity: contentOpacity,
          transform: contentTransform,
          transition: 'transform 0.1s ease-out'
        }}
      >
        {/* Left Editorial Column (col-span-12 lg:col-span-7 xl:col-span-6) */}
        <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center text-left max-w-2xl">
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[var(--brass-500)] opacity-75" />
            <span className="text-[0.74rem] sm:text-[0.78rem] uppercase tracking-[0.28em] font-medium text-[var(--brass-400)]">
              The Art of Indian Dining
            </span>
          </div>

          {/* Master Brand Headline */}
          <h1
            className="font-display text-[var(--ivory-50)] leading-[1.06] tracking-tight mb-4 select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.75rem)' }}
          >
            TISHA <br />
            <span className="text-gold-gradient font-light italic">RESTRO</span>
          </h1>

          {/* Hero Statement */}
          <blockquote className="font-editorial text-2xl sm:text-3xl lg:text-[2.1rem] text-[var(--ivory-100)] italic leading-snug mb-5 border-l-2 border-[var(--brass-500)] pl-4 py-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            “A journey through India's most extraordinary flavours.”
          </blockquote>

          {/* Supporting Editorial Copy */}
          <p className="text-[0.94rem] sm:text-[1.02rem] text-[var(--ivory-300)] font-body leading-relaxed mb-8 max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Where centuries of royal Awadhi dum cooking, ancestral Himalayan spices, and contemporary culinary artistry converge into a multi-sensory celebration of Indian gastronomy.
          </p>

          {/* Primary & Secondary Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <a
              href="#menu"
              onClick={onExploreMenu}
              className="btn-brass-primary group !px-7 !py-3.5 text-sm"
              id="hero-explore-menu-btn"
            >
              <span>Explore Menu</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>

            <button
              onClick={onReserveTable}
              className="btn-outline-brass group !px-7 !py-3.5 text-sm"
              id="hero-reserve-table-btn"
            >
              <Calendar className="w-4 h-4 text-[var(--brass-400)]" />
              <span>Reserve a Table</span>
            </button>
          </div>

          {/* Three-Pillar Heritage Badges */}
          <div className="pt-6 border-t border-[rgba(197,155,39,0.22)] grid grid-cols-3 gap-4 max-w-lg">
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.66rem] uppercase tracking-wider text-[var(--brass-400)] font-mono">Terroir</span>
              <span className="font-editorial text-sm sm:text-base text-[var(--ivory-200)] leading-tight">Pampore Saffron</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.66rem] uppercase tracking-wider text-[var(--brass-400)] font-mono">Craft</span>
              <span className="font-editorial text-sm sm:text-base text-[var(--ivory-200)] leading-tight">Dum Pukht 4-Hr</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[0.66rem] uppercase tracking-wider text-[var(--brass-400)] font-mono">Accolade</span>
              <span className="font-editorial text-sm sm:text-base text-[var(--ivory-200)] leading-tight">Grand Dining 2026</span>
            </div>
          </div>
        </div>

        {/* Right Atmospheric Space (Preserves the food video composition unblocked) */}
        <div className="lg:col-span-5 xl:col-span-6 flex flex-col items-end justify-end min-h-[80px] lg:min-h-[460px] pointer-events-none">
          {/* Subtle Live Cinema Status Badge */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(14,11,9,0.7)] backdrop-blur-md border border-[rgba(197,155,39,0.25)] text-[0.7rem] font-mono tracking-wider text-[var(--brass-200)] uppercase shadow-xl mb-4 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-[var(--brass-500)] animate-ping" />
            <span>Master Film • Live Platter & Steam</span>
          </div>
        </div>
      </div>

      {/* 4. DISCRETE FLOATING CINEMATIC VIDEO CONTROLS */}
      <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-12 z-30 flex items-center gap-2.5">
        {/* Unobtrusive Audio Toggle */}
        <button
          onClick={toggleMute}
          className="px-3.5 py-2 rounded-full bg-[rgba(14,11,9,0.85)] border border-[rgba(197,155,39,0.3)] text-[var(--brass-300)] hover:text-white hover:border-[var(--brass-500)] flex items-center gap-2 transition-all backdrop-blur-md shadow-2xl cursor-pointer text-xs"
          title={isMuted ? 'Turn Sound On' : 'Mute Video'}
          aria-label="Toggle Sound"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-[var(--brass-400)]" />
              <span className="font-mono text-[0.68rem] tracking-wider uppercase">Sound: Muted</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-[var(--brass-400)] animate-pulse" />
              <span className="font-mono text-[0.68rem] tracking-wider uppercase text-[var(--brass-200)]">Sound: On</span>
            </>
          )}
        </button>

        {/* Minimal Play / Pause Toggle */}
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-[rgba(14,11,9,0.85)] border border-[rgba(197,155,39,0.3)] text-[var(--brass-300)] hover:text-white hover:border-[var(--brass-500)] flex items-center justify-center transition-all backdrop-blur-md shadow-2xl cursor-pointer"
          title={isPlaying ? 'Pause Cinema' : 'Play Cinema'}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 translate-x-0.5 text-[var(--brass-400)]" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="hidden sm:flex w-9 h-9 rounded-full bg-[rgba(14,11,9,0.85)] border border-[rgba(197,155,39,0.3)] text-[var(--brass-300)] hover:text-white hover:border-[var(--brass-500)] items-center justify-center transition-all backdrop-blur-md shadow-2xl cursor-pointer"
          title="Fullscreen Cinema"
          aria-label="Fullscreen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}
