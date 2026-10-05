import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Flame,
  Clock,
  Compass,
  Layers,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const SCENES = [
  {
    id: 1,
    chapter: '01',
    title: 'Branding Emergence',
    subtitle: 'Awakening Royal Court Heritage',
    desc: 'Awakening the centuries-old royal court heritage of Tisha Restro.',
    narrative:
      'The ancestral seal of Awadh illuminates, signaling the commencement of a multi-sensory gastronomic feast steeped in Lucknowi nobility.',
    image: '/images/story_pin_1.jpg',
    technique: 'Imperial Court Protocol',
    tags: ['Royal Seal', 'Heritage Crest', 'Noor-e-Awadh'],
    duration: '04s'
  },
  {
    id: 2,
    chapter: '02',
    title: 'Cinematic Fire & Steam',
    subtitle: 'Wood Charcoal & Pot Simmering',
    desc: 'Charcoal embers, copper pot simmering & fragrant culinary mist.',
    narrative:
      'Hand-forged copper deghs meet live acacia wood charcoal, releasing fragrant plumes of saffron and cardamom steam into the candlelit hall.',
    image: '/images/story_pin_2.jpg',
    technique: 'Live Wood Charcoal Dum',
    tags: ['Acacia Embers', 'Copper Degh', 'Saffron Steam'],
    duration: '04s'
  },
  {
    id: 3,
    chapter: '03',
    title: 'Imperial Emerald Table',
    subtitle: 'Marble, Brass Thalis & Candle Glow',
    desc: 'Emerald Indian marble, beaten brass thali & intimate candlelight.',
    narrative:
      'Polished Rajasthan green marble reflects the warm glow of hand-cast brass lanterns and hand-carved jali latticework.',
    image: '/images/story_pin_3.jpg',
    technique: 'Haute Table Setting',
    tags: ['Green Marble', 'Beaten Brass', 'Jali Ambiance'],
    duration: '04s'
  },
  {
    id: 4,
    chapter: '04',
    title: '360° Culinary Orbit',
    subtitle: 'Hand-Beaten Heavy Brass Handi',
    desc: 'Cinematic camera rotates around the hand-beaten royal handi.',
    narrative:
      'A continuous 360-degree rotation exposes the handcrafted dimples of royal brassware, sealed with purdah dough to lock in essential aromatics.',
    image: '/images/story_pin_4.jpg',
    technique: 'Purdah Dough Seal',
    tags: ['Brass Handi', 'Artisanal Metal', 'Thermal Lock'],
    duration: '04s'
  },
  {
    id: 5,
    chapter: '05',
    title: 'Floating Botanical Spices',
    subtitle: 'Saffron Threads & Crushed Pods',
    desc: 'Saffron threads, cardamom pods & star anise lift into the air.',
    narrative:
      'Grade-A single-estate Kashmiri Mogra saffron, green Malabar cardamom, and star anise hover in delicate culinary levitation.',
    image: '/images/story_pin_5.jpg',
    technique: 'Single-Estate Sourcing',
    tags: ['Mogra Saffron', 'Malabar Pods', 'Star Anise'],
    duration: '04s'
  },
  {
    id: 6,
    chapter: '06',
    title: 'Spice Alchemy Separation',
    subtitle: '21 Secret Royal Court Botanicals',
    desc: 'Ingredients disperse into suspension, revealing their ancestral origins.',
    narrative:
      'The 21 ingredients of the royal Awadhi Potli Masala reveal their lineage—from mace flowers to stone lichens and dried rose petals.',
    image: '/images/story_pin_2.jpg',
    technique: 'Potli Masala Blend',
    tags: ['Mace Flower', 'Stone Lichen', 'Damascus Rose'],
    duration: '04s'
  },
  {
    id: 7,
    chapter: '07',
    title: 'Orbital Symphony',
    subtitle: 'Spices Dance in Celestial Resonance',
    desc: 'Spices dance in celestial resonance above the saffron rice.',
    narrative:
      'Whole botanicals orbit the glowing copper vessel in mathematical harmony, harmonizing volatile essential oils before the final descent.',
    image: '/images/story_pin_4.jpg',
    technique: 'Aromatics Harmonization',
    tags: ['Celestial Orbit', 'Essential Oils', 'Harmonic Balance'],
    duration: '04s'
  },
  {
    id: 8,
    chapter: '08',
    title: 'Convergence onto Plate',
    subtitle: 'Descent onto Fragrant Basmati',
    desc: 'Spices descend onto the fragrant basmati rice grains.',
    narrative:
      'The floating spices gently settle upon two-year aged long-grain basmati rice and slow-cooked milk-poached kid lamb.',
    image: '/images/story_pin_1.jpg',
    technique: 'Dum Convergence',
    tags: ['Aged Basmati', 'Tender Lamb', 'Infused Grains'],
    duration: '04s'
  },
  {
    id: 9,
    chapter: '09',
    title: 'The Finished Masterpiece',
    subtitle: '24k Gold Leaf & Caramelized Garnishes',
    desc: '24k gold leaf, fried shallots & mint garnish locked in dum.',
    narrative:
      'Cracked tableside, the dish reveals its crowning glory: hand-applied 24k edible gold leaf, crispy shallots, and fragrant garden mint.',
    image: '/images/story_pin_3.jpg',
    technique: 'Gold Leaf Plating',
    tags: ['24k Edible Gold', 'Crisp Shallots', 'Garden Mint'],
    duration: '04s'
  },
  {
    id: 10,
    chapter: '10',
    title: 'Gateway to the Feast',
    subtitle: 'Tasting Journey & Cellar Pairings',
    desc: 'Seamless transition into the interactive tasting journey.',
    narrative:
      'The story concludes at the table, inviting guests to explore the full interactive culinary repertoire, pairings, and bespoke bookings.',
    image: '/images/story_pin_5.jpg',
    technique: 'Grand Tasting Menu',
    tags: ['Tasting Menu', 'Sommelier Pairing', 'Imperial Feast'],
    duration: '04s'
  }
];

export default function ScrollStoryBar({ activeSceneIndex = 0, onSelectScene }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const currentIdx = Math.min(activeSceneIndex, SCENES.length - 1);
  const currentScene = SCENES[currentIdx];
  const timerRef = useRef(null);

  // Auto-progression playback timer
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalTime = 50; // ms
    const totalDuration = 4500; // 4.5s per scene
    const increment = (intervalTime / totalDuration) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          const nextIdx = (currentIdx + 1) % SCENES.length;
          if (onSelectScene) onSelectScene(nextIdx);
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIdx, onSelectScene]);

  // Reset progress on scene switch
  const handleSelect = (idx) => {
    setProgress(0);
    if (onSelectScene) onSelectScene(idx);
  };

  const handlePrev = () => {
    const prevIdx = (currentIdx - 1 + SCENES.length) % SCENES.length;
    handleSelect(prevIdx);
  };

  const handleNext = () => {
    const nextIdx = (currentIdx + 1) % SCENES.length;
    handleSelect(nextIdx);
  };

  return (
    <section className="section-container my-10" id="cinematic-story-progression">
      {/* Outer Luxury Card Container */}
      <div
        className="relative rounded-2xl border border-[rgba(197,155,39,0.35)] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
        style={{
          background: 'linear-gradient(180deg, rgba(24, 18, 14, 0.95) 0%, rgba(14, 11, 9, 0.98) 100%)',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Glowing Background Radial Accents */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(197,155,39,0.12)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(224,122,67,0.08)_0%,transparent_70%)] pointer-events-none" />

        {/* 1. TOP HEADER & CHAPTER METADATA BAR */}
        <div className="p-4 sm:p-5 border-b border-[rgba(197,155,39,0.2)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg border border-[var(--brass-500)] flex items-center justify-center bg-[rgba(197,155,39,0.15)] text-[var(--brass-300)] font-mono text-sm font-bold shadow-[0_0_12px_rgba(197,155,39,0.25)] shrink-0">
              {currentScene.chapter}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[0.62rem] font-mono tracking-[0.25em] uppercase text-[var(--brass-400)] flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[var(--brass-400)]" />
                  <span>Cinematic Story Progression</span>
                </span>
                <span className="text-[0.58rem] px-2 py-0.5 rounded-full bg-[rgba(197,155,39,0.15)] text-[var(--brass-300)] font-mono">
                  Scene {currentScene.id} of 10
                </span>
              </div>
              <h2 className="font-display text-base sm:text-lg text-[var(--ivory-50)] m-0 font-medium">
                {currentScene.title}{' '}
                <span className="font-editorial italic text-xs sm:text-sm text-[var(--brass-300)] font-normal ml-1">
                  — {currentScene.subtitle}
                </span>
              </h2>
            </div>
          </div>

          {/* Playback Controls & Navigation */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-2.5 py-1.5 rounded-lg border border-[rgba(197,155,39,0.3)] bg-[rgba(197,155,39,0.1)] hover:bg-[rgba(197,155,39,0.2)] text-[var(--brass-300)] hover:text-white transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-sm"
              title={isPlaying ? 'Pause Auto-Play' : 'Resume Auto-Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPlaying ? 'Auto-Story' : 'Paused'}</span>
            </button>

            <div className="flex items-center rounded-lg border border-[var(--border-subtle)] bg-[rgba(0,0,0,0.3)] p-0.5">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1 rounded text-[var(--ivory-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-all cursor-pointer"
                title="Previous Scene"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-1 rounded text-[var(--ivory-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-all cursor-pointer"
                title="Next Scene"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. CINEMATIC SHOWCASE BODY (Visual + Editorial Narrative) */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Left: Framed High-Definition Visual with Golden Corner Brackets */}
          <div className="lg:col-span-5 relative group">
            <div
              className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-[rgba(197,155,39,0.35)] shadow-xl"
              style={{ backgroundColor: '#0a0807' }}
            >
              <img
                src={currentScene.image}
                alt={currentScene.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,8,7,0.85)] via-transparent to-black/20" />

              {/* Bottom Visual Overlay Tag */}
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                <span className="text-[0.62rem] px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-[rgba(197,155,39,0.4)] text-[var(--brass-300)] font-mono flex items-center gap-1">
                  <Flame className="w-2.5 h-2.5 text-[var(--brass-400)]" />
                  <span>{currentScene.technique}</span>
                </span>
                <span className="text-[0.58rem] font-mono text-[var(--ivory-muted)] bg-black/60 px-1.5 py-0.5 rounded">
                  {currentScene.duration}
                </span>
              </div>
            </div>

            {/* Brass Corner Filigree Elements */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[var(--brass-400)] pointer-events-none" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[var(--brass-400)] pointer-events-none" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[var(--brass-400)] pointer-events-none" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[var(--brass-400)] pointer-events-none" />
          </div>

          {/* Right: Editorial Quote, Lore Narrative, and Spice Metadata */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-3.5">
            <div>
              <blockquote className="font-editorial text-base sm:text-lg text-[var(--ivory-100)] italic leading-relaxed m-0 border-l-2 border-[var(--brass-500)] pl-3.5">
                “{currentScene.desc}”
              </blockquote>
              <p className="mt-2.5 text-xs sm:text-sm text-[var(--ivory-muted)] font-body leading-relaxed">
                {currentScene.narrative}
              </p>
            </div>

            {/* Royal Culinary Botanical Tags */}
            <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center gap-1.5 flex-wrap">
              <span className="text-[0.6rem] font-mono uppercase tracking-widest text-[var(--brass-400)] mr-1 flex items-center gap-1">
                <Layers className="w-2.5 h-2.5" />
                <span>Lineage Elements:</span>
              </span>
              {currentScene.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2.5 py-0.5 rounded-full bg-[rgba(197,155,39,0.12)] border border-[rgba(197,155,39,0.3)] text-[0.65rem] text-[var(--ivory-200)] font-mono"
                >
                  ✦ {tag}
                </span>
              ))}
            </div>

            {/* Quick Action Navigation */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="#menu-section"
                className="btn-brass-primary !py-1 !px-3 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Explore in Tasting Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#our-story"
                className="text-xs text-[var(--brass-300)] hover:text-white font-mono flex items-center gap-1 transition-colors"
              >
                <span>Read Royal Khansama Lore</span>
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* 3. 10-CHAPTER INTERACTIVE PROGRESSION SCRUB TIMELINE */}
        <div
          className="px-4 sm:px-6 py-3.5 border-t"
          style={{
            backgroundColor: '#0c0a08',
            borderColor: 'rgba(197, 155, 39, 0.25)'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="font-mono tracking-widest uppercase flex items-center gap-1 font-semibold"
              style={{ fontSize: '0.62rem', color: '#dfb958' }}
            >
              <Compass className="w-3 h-3 text-[var(--brass-400)]" />
              <span>Chapter Timeline (Click to Scrub)</span>
            </span>
            <span
              className="font-mono"
              style={{ fontSize: '0.65rem', color: '#dfb958' }}
            >
              {currentScene.chapter} / 10 • {currentScene.title}
            </span>
          </div>

          {/* Explicit 10-Column Horizontal Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
              gap: '0.4rem',
              width: '100%'
            }}
          >
            {SCENES.map((scene, idx) => {
              const isActive = idx === currentIdx;
              const isPassed = idx < currentIdx;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => handleSelect(idx)}
                  className="group cursor-pointer transition-all"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.2rem',
                    borderRadius: '6px',
                    backgroundColor: isActive
                      ? 'rgba(197, 155, 39, 0.25)'
                      : isPassed
                      ? 'rgba(197, 155, 39, 0.08)'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: isActive
                      ? '1px solid #dfb958'
                      : isPassed
                      ? '1px solid rgba(197, 155, 39, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isActive ? '0 0 10px rgba(197, 155, 39, 0.35)' : 'none'
                  }}
                  title={`Chapter ${scene.chapter}: ${scene.title}`}
                >
                  {/* Dynamic Progress Indicator Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '3px',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        backgroundColor: '#dfb958',
                        width: isActive ? `${progress}%` : isPassed ? '100%' : '0%',
                        transition: isActive ? 'width 0.08s linear' : 'none'
                      }}
                    />
                  </div>

                  {/* Step Number */}
                  <span
                    className="font-mono font-bold"
                    style={{
                      fontSize: '0.68rem',
                      color: isActive ? '#ffffff' : isPassed ? '#dfb958' : '#8c827a'
                    }}
                  >
                    {scene.chapter}
                  </span>

                  {/* Short Title */}
                  <span
                    className="hidden xl:block font-display truncate leading-none text-center"
                    style={{
                      fontSize: '0.55rem',
                      color: isActive ? '#ffffff' : '#a8a29e',
                      maxWidth: '75px'
                    }}
                  >
                    {scene.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
