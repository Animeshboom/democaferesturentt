import React, { useState } from 'react';
import { EXPERIENCES } from '../data/experienceData';
import { PINTEREST_VIDEOS } from '../data/videoData';
import { Sparkles, Users, Check, ArrowRight, Video, Image as ImageIcon, Film } from 'lucide-react';
import PinterestReelPlayer from './PinterestReelPlayer';

export default function ExperienceSection({ onReserve }) {
  // Modes: 'suites' | 'interiorVideos'
  const [viewMode, setViewMode] = useState('suites');
  const [activeSuiteTab, setActiveSuiteTab] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const currentSuite = EXPERIENCES[activeSuiteTab];
  const interiorVideos = PINTEREST_VIDEOS.interior;
  const currentVideo = interiorVideos[activeVideoIndex];

  return (
    <section id="experience" className="relative py-28 overflow-hidden" style={{ backgroundColor: '#0a0807' }}>
      {/* Opulent Pinterest Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/images/experience_bg.jpg"
          alt="Tisha Experience Sanctuary Ambiance"
          className="w-full h-full object-cover opacity-25 scale-105 filter blur-[2px]"
          style={{ objectPosition: 'center 40%' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #0a0807 0%, rgba(10,8,7,0.85) 20%, rgba(10,8,7,0.75) 50%, rgba(10,8,7,0.9) 80%, #0a0807 100%)'
          }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(circle,rgba(197,155,39,0.15)_0%,transparent_70%)] blur-2xl" />
      </div>

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-eyebrow">Hospitality & Ambiance</span>
          <h2 className="section-title">
            The Tisha <span className="text-gold-gradient">Experience</span>
          </h2>
          <p className="section-description">
            Four immersive architectural sanctuaries designed to transform your evening into an unforgettable sensory journey.
          </p>
          <div className="ornate-divider">
            <span className="ornate-divider-line" />
            <span className="ornate-diamond" />
            <span className="ornate-divider-line right" />
          </div>
        </div>

        {/* View Mode Switcher: Sanctuary Suites vs Live Walkthrough Reels */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[rgba(18,15,13,0.85)] border border-[var(--border-subtle)] backdrop-blur-md">
            <button
              onClick={() => setViewMode('suites')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                viewMode === 'suites'
                  ? 'bg-[var(--brass-500)] text-[#0c0a08] shadow-[0_0_15px_rgba(197,155,39,0.4)]'
                  : 'text-[var(--ivory-300)] hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Sanctuary Suites</span>
            </button>

            <button
              onClick={() => setViewMode('interiorVideos')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                viewMode === 'interiorVideos'
                  ? 'bg-[var(--brass-500)] text-[#0c0a08] shadow-[0_0_15px_rgba(197,155,39,0.4)]'
                  : 'text-[var(--ivory-300)] hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Live Walkthrough Videos ({interiorVideos.length})</span>
            </button>
          </div>
        </div>

        {/* MODE 1: Photographic Suite Showcase */}
        {viewMode === 'suites' && (
          <div>
            {/* Tab Selection */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-12">
              {EXPERIENCES.map((exp, idx) => (
                <button
                  key={exp.id}
                  onClick={() => setActiveSuiteTab(idx)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-[0.78rem] tracking-wider uppercase font-medium transition-all ${
                    activeSuiteTab === idx
                      ? 'bg-[var(--brass-500)] text-[#0c0a08] font-bold shadow-[0_0_20px_rgba(197,155,39,0.35)]'
                      : 'bg-[rgba(18,15,13,0.6)] border border-[var(--border-subtle)] text-[var(--ivory-300)] hover:text-white hover:border-[var(--brass-500)]'
                  }`}
                >
                  {exp.title}
                </button>
              ))}
            </div>

            {/* Experience Showcase Card */}
            <div className="rounded-xl border border-[var(--border-brass)] bg-[rgba(20,16,13,0.85)] backdrop-blur-xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
              {/* Image Showcase (6 cols) */}
              <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto min-h-[360px] overflow-hidden">
                <img
                  src={currentSuite.image}
                  alt={currentSuite.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,8,7,0.85)] via-transparent to-transparent lg:hidden" />
                <div className="absolute bottom-4 left-4 right-4 lg:hidden">
                  <span className="text-xs uppercase tracking-widest text-[var(--brass-400)] block font-mono">
                    {currentSuite.devanagari}
                  </span>
                  <h4 className="font-display text-xl text-white">{currentSuite.title}</h4>
                </div>
              </div>

              {/* Narrative Content & Features (6 cols) */}
              <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[var(--brass-400)] font-mono block mb-1">
                    {currentSuite.devanagari}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl text-[var(--ivory-50)] mb-2">
                    {currentSuite.title}
                  </h3>
                  <p className="font-editorial text-lg text-[var(--brass-300)] italic mb-6">
                    “{currentSuite.subtitle}”
                  </p>

                  <p className="text-[0.9rem] text-[var(--ivory-300)] font-body leading-relaxed mb-6">
                    {currentSuite.description}
                  </p>

                  {/* Curated Highlights */}
                  <div className="mb-6">
                    <span className="text-[0.68rem] uppercase tracking-wider text-[var(--ivory-muted)] font-mono block mb-3">
                      Signature Highlights
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentSuite.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[var(--ivory-200)]">
                          <Check className="w-3.5 h-3.5 text-[var(--brass-400)] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Recommendation & Reservation Trigger */}
                <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5 text-xs text-[var(--ivory-muted)]">
                    <span className="text-[var(--brass-400)] font-semibold uppercase text-[0.68rem] tracking-wider font-mono">
                      Recommended For
                    </span>
                    <span className="text-[var(--ivory-200)] font-editorial italic text-sm">{currentSuite.recommendedFor}</span>
                  </div>

                  <button
                    onClick={onReserve}
                    className="btn-brass-primary !py-2.5 !px-5 text-xs self-start sm:self-auto"
                  >
                    <span>Reserve this Zone</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: Live Interior Walkthrough Video Reels */}
        {viewMode === 'interiorVideos' && (
          <div className="space-y-6">
            {/* Interior Video Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {interiorVideos.map((video, idx) => (
                <button
                  key={video.id}
                  onClick={() => setActiveVideoIndex(idx)}
                  className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all ${
                    activeVideoIndex === idx
                      ? 'bg-[var(--brass-500)] text-[#0c0a08] font-bold shadow-md'
                      : 'bg-[rgba(18,15,13,0.7)] border border-[var(--border-subtle)] text-[var(--ivory-muted)] hover:text-white'
                  }`}
                >
                  <span>Reel 0{idx + 1}: {video.title}</span>
                </button>
              ))}
            </div>

            {/* Video Player Display Card */}
            <div className="max-w-4xl mx-auto rounded-xl border border-[var(--border-brass)] bg-[rgba(20,16,13,0.9)] backdrop-blur-xl p-6 sm:p-8 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Video Player (5 cols) */}
              <div className="md:col-span-5 flex justify-center">
                <PinterestReelPlayer
                  key={currentVideo.id}
                  videoId={currentVideo.id}
                  title={currentVideo.title}
                  category={currentVideo.category}
                  maxHeight="520px"
                />
              </div>

              {/* Right Narrative & Walkthrough details (7 cols) */}
              <div className="md:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--brass-400)] font-mono mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--brass-500)]" />
                    <span>Architectural Cinema • Reel {activeVideoIndex + 1} of {interiorVideos.length}</span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl text-[var(--ivory-50)] mb-3">
                    {currentVideo.title}
                  </h3>

                  <p className="font-editorial text-lg text-[var(--brass-300)] italic mb-6">
                    “{currentVideo.description}”
                  </p>

                  <div className="p-4 rounded-lg bg-[rgba(10,8,7,0.6)] border border-[var(--border-subtle)] text-xs text-[var(--ivory-300)] space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-[var(--brass-400)] font-semibold">Atmospheric Design:</span>
                      <span>Hand-cut Jali Screens & Candlelight</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--brass-400)] font-semibold">Soundscape:</span>
                      <span>Gentle Acoustic Sitar Resonance</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--brass-400)] font-semibold">Seating Service:</span>
                      <span>Dedicated Table Sommelier</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-xs text-[var(--ivory-muted)] font-editorial italic">
                    ✦ Step inside the world of Tisha Restro
                  </span>
                  <button onClick={onReserve} className="btn-brass-primary !py-2.5 !px-5 text-xs">
                    <span>Reserve an Evening Here</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
