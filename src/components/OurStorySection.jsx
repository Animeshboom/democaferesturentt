import React, { useState } from 'react';
import { STORY_MILESTONES } from '../data/storyData';
import { PINTEREST_VIDEOS } from '../data/videoData';
import { Sparkles, Flame, Film, Image as ImageIcon } from 'lucide-react';
import PinterestReelPlayer from './PinterestReelPlayer';

export default function OurStorySection() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeKitchenReel, setActiveKitchenReel] = useState(0);
  const [mediaMode, setMediaMode] = useState('photo'); // 'photo' | 'kitchenReel'

  const current = STORY_MILESTONES[activeStep];
  const kitchenVideos = PINTEREST_VIDEOS.kitchen;

  return (
    <section id="story" className="relative py-28 overflow-hidden" style={{ backgroundColor: '#0a0807' }}>
      {/* Opulent Pinterest Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/images/our_story_bg.jpg"
          alt="Ancestral Legacy Story Background"
          className="w-full h-full object-cover opacity-20 scale-105 filter blur-[2px]"
          style={{ objectPosition: 'center 35%' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #0a0807 0%, rgba(10,8,7,0.86) 20%, rgba(10,8,7,0.78) 50%, rgba(10,8,7,0.92) 85%, #0a0807 100%)'
          }}
        />
        <div className="absolute top-1/4 right-10 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(197,155,39,0.12)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-1/4 left-10 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(224,122,67,0.08)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-eyebrow">Ancestral Legacy</span>
          <h2 className="section-title">
            The Story Behind <span className="text-gold-gradient">Every Plate</span>
          </h2>
          <p className="section-description">
            Centuries of royal court culinary secrets reimagined through contemporary culinary restraint and single-estate terroirs.
          </p>
          <div className="ornate-divider">
            <span className="ornate-divider-line" />
            <span className="ornate-diamond" />
            <span className="ornate-divider-line right" />
          </div>
        </div>

        {/* Visual Timeline Stepper */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {STORY_MILESTONES.map((item, idx) => (
            <button
              key={item.step}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-lg text-left transition-all border ${
                activeStep === idx
                  ? 'bg-[rgba(197,155,39,0.12)] border-[var(--brass-500)] shadow-[0_4px_25px_rgba(197,155,39,0.25)]'
                  : 'bg-[rgba(18,15,13,0.5)] border-[var(--border-subtle)] hover:border-[var(--brass-400)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-[var(--brass-400)] font-bold">{item.step}</span>
                <span className="text-[0.65rem] tracking-widest uppercase text-[var(--ivory-muted)]">
                  {item.tag}
                </span>
              </div>
              <h4 className="font-display text-lg text-[var(--ivory-50)] mb-1">{item.era}</h4>
              <p className="font-editorial text-xs text-[var(--ivory-muted)] italic truncate">
                {item.devanagari}
              </p>
            </button>
          ))}
        </div>

        {/* Featured Story Focus Card */}
        <div className="rounded-xl border border-[var(--border-brass)] bg-[rgba(20,16,13,0.85)] backdrop-blur-xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--brass-400)] mb-2 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[var(--brass-500)]" />
              <span>Phase {current.step} — {current.tag}</span>
            </div>

            <h3 className="font-display text-3xl sm:text-4xl text-[var(--ivory-50)] mb-2">
              {current.title}
            </h3>

            <span className="font-editorial text-lg text-[var(--brass-300)] italic mb-6 block">
              {current.devanagari}
            </span>

            <p className="text-[0.94rem] text-[var(--ivory-300)] font-body leading-relaxed mb-6">
              {current.description}
            </p>

            {/* Highlight Metric / Principle */}
            <div className="p-4 rounded border border-[var(--border-subtle)] bg-[rgba(10,8,7,0.6)] flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full border border-[var(--brass-500)] flex items-center justify-center bg-[rgba(197,155,39,0.1)] shrink-0">
                <Flame className="w-5 h-5 text-[var(--saffron-400)]" />
              </div>
              <div className="flex flex-col gap-1 text-left">
                <span className="text-[0.68rem] tracking-wider uppercase text-[var(--brass-400)] font-mono">
                  Culinary Pillar
                </span>
                <span className="font-editorial text-base text-[var(--ivory-100)] font-semibold leading-snug">
                  {current.highlight}
                </span>
              </div>
            </div>

            {/* Media Mode Switcher (Photo vs Live Kitchen Video) */}
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-[var(--brass-400)] font-mono">
                Visual View:
              </span>
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-[rgba(10,8,7,0.7)] border border-[var(--border-subtle)]">
                <button
                  onClick={() => setMediaMode('photo')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wider transition-all ${
                    mediaMode === 'photo'
                      ? 'bg-[var(--brass-500)] text-[#0c0a08] font-bold'
                      : 'text-[var(--ivory-muted)] hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Photo Still</span>
                </button>
                <button
                  onClick={() => setMediaMode('kitchenReel')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wider transition-all ${
                    mediaMode === 'kitchenReel'
                      ? 'bg-[var(--brass-500)] text-[#0c0a08] font-bold'
                      : 'text-[var(--ivory-muted)] hover:text-white'
                  }`}
                >
                  <Film className="w-3 h-3" />
                  <span>Kitchen Theatre Video ({kitchenVideos.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Visual Area (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {mediaMode === 'photo' ? (
              <div className="relative w-full rounded-lg overflow-hidden border border-[var(--border-subtle)] shadow-xl aspect-[4/3] lg:aspect-square">
                <img
                  src="/images/our_story_bg.jpg"
                  alt="Ancestral Dum Cooking Technique"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,8,7,0.85)] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-xs text-[var(--ivory-200)] font-editorial italic">
                  ✦ Hand-forged copper deghs and live wood charcoal embers preserve essential spice oils.
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center space-y-3">
                {/* Kitchen Reel Selector */}
                <div className="flex items-center gap-1.5 w-full overflow-x-auto pb-1 no-scrollbar">
                  {kitchenVideos.map((kv, idx) => (
                    <button
                      key={kv.id}
                      onClick={() => setActiveKitchenReel(idx)}
                      className={`shrink-0 px-2.5 py-1 rounded text-[0.65rem] font-mono uppercase tracking-wider transition-all ${
                        activeKitchenReel === idx
                          ? 'bg-[var(--brass-500)] text-[#0c0a08] font-bold'
                          : 'bg-[rgba(18,15,13,0.7)] border border-[var(--border-subtle)] text-[var(--ivory-muted)]'
                      }`}
                    >
                      Reel 0{idx + 1}
                    </button>
                  ))}
                </div>

                <PinterestReelPlayer
                  key={kitchenVideos[activeKitchenReel].id}
                  videoId={kitchenVideos[activeKitchenReel].id}
                  title={kitchenVideos[activeKitchenReel].title}
                  category={kitchenVideos[activeKitchenReel].category}
                  maxHeight="440px"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
