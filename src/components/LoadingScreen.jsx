import React, { useEffect, useState } from 'react';

export default function LoadingScreen({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDone(true);
            if (onLoaded) onLoaded();
          }, 350);
          return 100;
        }
        return prev + Math.floor(Math.random() * 18 + 12);
      });
    }, 90);

    return () => clearInterval(timer);
  }, [onLoaded]);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0a0807] transition-opacity duration-700 ${
        progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center max-w-sm px-6 text-center">
        {/* Rotating Sacred Spice Mandala Emblem */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[rgba(197,155,39,0.25)] animate-spin" style={{ animationDuration: '14s' }}>
            <div className="w-2 h-2 rounded-full bg-[var(--brass-400)] absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="w-16 h-16 rounded-full border border-[var(--brass-500)] flex items-center justify-center bg-[rgba(197,155,39,0.06)] shadow-[0_0_30px_rgba(197,155,39,0.25)]">
            <span className="font-display text-xl text-[var(--brass-300)] tracking-widest font-bold">TR</span>
          </div>
        </div>

        <h2 className="font-display text-2xl tracking-[0.25em] text-[var(--ivory-50)] uppercase mb-2">
          TISHA RESTRO
        </h2>
        <p className="text-[0.78rem] tracking-[0.2em] uppercase text-[var(--brass-400)] font-body mb-8">
          The Art of Indian Dining
        </p>

        {/* Progress bar */}
        <div className="w-48 h-[2px] bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden mb-3 relative">
          <div
            className="h-full bg-gradient-to-r from-[var(--brass-500)] to-[var(--brass-300)] transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[0.72rem] text-[var(--ivory-muted)] font-editorial italic tracking-wider">
          Preparing your sensory culinary journey... {progress}%
        </p>
      </div>
    </div>
  );
}
