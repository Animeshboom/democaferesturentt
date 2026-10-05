import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Maximize2 } from 'lucide-react';
import { ALL_REELS } from '../data/videoData';

export default function PinterestReelPlayer({
  videoId,
  title,
  category,
  aspect = 'aspect-[9/16]',
  className = '',
  maxHeight = '560px'
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef(null);

  // Match pin from ALL_REELS
  const reelData = ALL_REELS.find((r) => r.id === String(videoId)) || {};
  const videoUrl = reelData.videoUrl;
  const posterUrl = reelData.posterUrl;
  const displayTitle = title || reelData.title || 'Cinematic Culinary Reel';
  const displayCategory = category || reelData.category || 'Hospitality';

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => {
        // Autoplay may need user gesture for audio
        setIsPlaying(false);
      });
    }
  }, [videoId, isMuted]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden border border-[var(--border-brass)] bg-[#0d0a08] shadow-[0_15px_50px_rgba(0,0,0,0.85)] flex flex-col items-center justify-center group ${className}`}
      style={{ maxHeight, position: 'relative' }}
      onClick={togglePlay}
    >
      {/* Corner Filigree Brass Accents */}
      <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[var(--brass-400)] z-20 pointer-events-none" />
      <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[var(--brass-400)] z-20 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[var(--brass-400)] z-20 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[var(--brass-400)] z-20 pointer-events-none" />

      {/* Native Full-Size HTML5 Video Player */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black" style={{ minHeight: '380px' }}>
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onLoadedData={() => setLoaded(true)}
            className="w-full h-full object-cover cursor-pointer transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <img
            src={posterUrl || '/images/ambience_dining.jpg'}
            alt={displayTitle}
            className="w-full h-full object-cover"
            onLoad={() => setLoaded(true)}
          />
        )}

        {/* Ambient Dark Gradient Edge Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,8,7,0.85)] via-transparent to-[rgba(10,8,7,0.3)] pointer-events-none z-10" />

        {/* Play/Pause Overlay indicator on Pause or Hover */}
        {!isPlaying && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-[rgba(10,8,7,0.5)] z-20 backdrop-blur-[2px] transition-opacity"
            onClick={togglePlay}
          >
            <div className="w-14 h-14 rounded-full border border-[var(--brass-400)] bg-[rgba(197,155,39,0.2)] backdrop-blur-md flex items-center justify-center shadow-[0_0_25px_rgba(197,155,39,0.5)]">
              <Play className="w-6 h-6 text-[var(--brass-200)] translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Top Floating Badge */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-[rgba(10,8,7,0.85)] border border-[rgba(197,155,39,0.3)] text-[0.62rem] font-mono tracking-widest text-[var(--brass-300)] uppercase backdrop-blur-md">
            HD Master
          </span>
        </div>

        {/* Audio Mute/Unmute Pill Control */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-full bg-[rgba(10,8,7,0.85)] border border-[rgba(197,155,39,0.3)] text-[var(--brass-300)] hover:text-white flex items-center justify-center transition-all backdrop-blur-md cursor-pointer hover:border-[var(--brass-500)]"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label="Toggle audio"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[var(--brass-400)]" />}
          </button>
        </div>
      </div>

      {/* Overlay caption bar */}
      <div className="w-full px-4 py-2.5 bg-[rgba(14,11,9,0.95)] border-t border-[var(--border-subtle)] flex items-center justify-between z-20 text-xs">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-[var(--brass-400)] shrink-0 animate-pulse" />
          <span className="font-display text-[var(--ivory-50)] truncate tracking-wide">{displayTitle}</span>
        </div>
        <span className="text-[0.62rem] text-[var(--brass-400)] uppercase font-mono tracking-widest shrink-0 ml-2">
          {displayCategory}
        </span>
      </div>
    </div>
  );
}
