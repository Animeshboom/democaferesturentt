import React, { useState } from 'react';
import { CHEF_PHILOSOPHY } from '../data/storyData';
import { PINTEREST_VIDEOS } from '../data/videoData';
import { Award, Utensils, Film, Image as ImageIcon } from 'lucide-react';
import PinterestReelPlayer from './PinterestReelPlayer';

export default function ChefSection() {
  const [viewMode, setViewMode] = useState('portrait'); // 'portrait' | 'video'
  const [activeChefVideoIndex, setActiveChefVideoIndex] = useState(0);

  const chefVideos = PINTEREST_VIDEOS.chef;
  const currentChefVideo = chefVideos[activeChefVideoIndex];

  return (
    <section className="relative py-28 bg-[var(--bg-secondary)] overflow-hidden">
      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Chef Visual Area (5 cols) */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            {/* View Mode Switcher Pill */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-[rgba(18,15,13,0.85)] border border-[var(--border-subtle)] mb-4 z-20">
              <button
                onClick={() => setViewMode('portrait')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                  viewMode === 'portrait'
                    ? 'bg-[var(--brass-500)] text-[#0c0a08] font-bold'
                    : 'text-[var(--ivory-muted)] hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Portrait</span>
              </button>

              <button
                onClick={() => setViewMode('video')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                  viewMode === 'video'
                    ? 'bg-[var(--brass-500)] text-[#0c0a08] font-bold'
                    : 'text-[var(--ivory-muted)] hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Chef Launch Video ({chefVideos.length})</span>
              </button>
            </div>

            {viewMode === 'portrait' ? (
              <div className="relative w-full max-w-md rounded-lg overflow-hidden border border-[var(--border-brass-bright)] shadow-[0_20px_60px_rgba(0,0,0,0.85)] aspect-[3/4]">
                <img
                  src="/images/chef_portrait.jpg"
                  alt={CHEF_PHILOSOPHY.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,8,7,0.9)] via-transparent to-transparent" />

                {/* Monogram Seal on Portrait */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded bg-[rgba(18,15,13,0.85)] backdrop-blur-md border border-[var(--border-subtle)] flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-lg text-[var(--ivory-50)]">{CHEF_PHILOSOPHY.name}</h4>
                    <span className="text-xs text-[var(--brass-400)] uppercase tracking-wider block font-mono">
                      {CHEF_PHILOSOPHY.title}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-[var(--brass-500)] flex items-center justify-center bg-[rgba(197,155,39,0.15)]">
                    <Utensils className="w-4 h-4 text-[var(--brass-300)]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center space-y-3">
                <div className="flex items-center gap-2">
                  {chefVideos.map((cv, idx) => (
                    <button
                      key={cv.id}
                      onClick={() => setActiveChefVideoIndex(idx)}
                      className={`px-3 py-1 rounded text-xs font-mono uppercase tracking-wider transition-all ${
                        activeChefVideoIndex === idx
                          ? 'bg-[var(--brass-500)] text-[#0c0a08] font-bold'
                          : 'bg-[rgba(18,15,13,0.7)] border border-[var(--border-subtle)] text-[var(--ivory-muted)]'
                      }`}
                    >
                      Launch Reel 0{idx + 1}
                    </button>
                  ))}
                </div>

                <PinterestReelPlayer
                  key={currentChefVideo.id}
                  videoId={currentChefVideo.id}
                  title={currentChefVideo.title}
                  category={currentChefVideo.category}
                  maxHeight="500px"
                />
              </div>
            )}
          </div>

          {/* Chef Philosophy & Editorial Spread (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--brass-400)] mb-3 font-mono">
              <Award className="w-4 h-4 text-[var(--brass-500)]" />
              <span>Culinary Direction & Philosophy</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[var(--ivory-50)] leading-tight mb-2">
              Mastery of the <span className="text-gold-gradient">Royal Kitchen</span>
            </h2>

            <span className="font-editorial text-xl text-[var(--brass-300)] italic mb-6 block">
              {CHEF_PHILOSOPHY.devanagari}
            </span>

            {/* Featured Quote */}
            <blockquote className="font-editorial text-2xl sm:text-3xl text-[var(--ivory-100)] italic leading-relaxed mb-6 border-l-2 border-[var(--brass-500)] pl-6 py-2">
              {CHEF_PHILOSOPHY.quote}
            </blockquote>

            <p className="text-[0.92rem] text-[var(--ivory-300)] font-body leading-relaxed mb-8">
              {CHEF_PHILOSOPHY.bio}
            </p>

            {/* Signature Dish Pill */}
            <div className="p-5 rounded-lg border border-[var(--border-subtle)] bg-[rgba(18,15,13,0.7)] backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1 text-left">
                <span className="text-[0.68rem] uppercase tracking-widest text-[var(--brass-400)] font-mono">
                  Chef's Personal Masterpiece
                </span>
                <span className="font-editorial text-lg text-[var(--ivory-100)] leading-snug">
                  {CHEF_PHILOSOPHY.signature}
                </span>
              </div>
              <a
                href="#menu"
                className="btn-outline-brass text-xs !py-2 !px-4 self-start sm:self-auto"
              >
                <span>View on Menu</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
