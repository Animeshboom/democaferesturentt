import React, { useState } from 'react';
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from '../data/galleryData';
import { PINTEREST_VIDEOS } from '../data/videoData';
import { Eye, X, ZoomIn, ChevronLeft, ChevronRight, Film, Image as ImageIcon, Sparkles } from 'lucide-react';
import PinterestReelPlayer from './PinterestReelPlayer';

export default function GallerySection() {
  const [galleryMode, setGalleryMode] = useState('stills'); // 'stills' | 'reels'
  const [activeCat, setActiveCat] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Video reels category filter
  const [videoReelFilter, setVideoReelFilter] = useState('all');

  // Flatten all 14 videos into a single array with category tags
  const allReels = [
    ...PINTEREST_VIDEOS.interior.map((v) => ({ ...v, type: 'interior', typeLabel: 'Interior View' })),
    ...PINTEREST_VIDEOS.kitchen.map((v) => ({ ...v, type: 'kitchen', typeLabel: 'Kitchen Theatre' })),
    ...PINTEREST_VIDEOS.food.map((v) => ({ ...v, type: 'food', typeLabel: 'Food & Plating' })),
    ...PINTEREST_VIDEOS.chef.map((v) => ({ ...v, type: 'chef', typeLabel: 'Chef Launch' }))
  ];

  const filteredReels = allReels.filter((r) => {
    if (videoReelFilter === 'all') return true;
    return r.type === videoReelFilter;
  });

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeCat === 'all') return true;
    return item.category === activeCat;
  });

  const activeLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section id="gallery" className="relative py-28 overflow-hidden" style={{ backgroundColor: '#0e0b09' }}>
      {/* Opulent Pinterest Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/images/gallery_bg.jpg"
          alt="Visual Chronicle Background Atmosphere"
          className="w-full h-full object-cover opacity-20 scale-105 filter blur-[2px]"
          style={{ objectPosition: 'center 30%' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #0a0807 0%, rgba(14,11,9,0.88) 25%, rgba(14,11,9,0.8) 50%, rgba(14,11,9,0.92) 80%, #0a0807 100%)'
          }}
        />
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(197,155,39,0.12)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(224,122,67,0.1)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-eyebrow">Visual Chronicle</span>
          <h2 className="section-title">
            Moments in <span className="text-gold-gradient">Motion & Stillness</span>
          </h2>
          <p className="section-description">
            A curated photographic and cinematic exploration of flame, copper, marble, and royal culinary theatre.
          </p>
          <div className="ornate-divider">
            <span className="ornate-divider-line" />
            <span className="ornate-diamond" />
            <span className="ornate-divider-line right" />
          </div>
        </div>

        {/* Master Media Mode Switcher (Photographic Stills vs Live Video Reels) */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[rgba(18,15,13,0.85)] border border-[var(--border-subtle)] backdrop-blur-md">
            <button
              onClick={() => setGalleryMode('stills')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                galleryMode === 'stills'
                  ? 'bg-[var(--brass-500)] text-[#0c0a08] shadow-[0_0_15px_rgba(197,155,39,0.4)]'
                  : 'text-[var(--ivory-300)] hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photographic Chronicle</span>
            </button>

            <button
              onClick={() => setGalleryMode('reels')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                galleryMode === 'reels'
                  ? 'bg-[var(--brass-500)] text-[#0c0a08] shadow-[0_0_15px_rgba(197,155,39,0.4)]'
                  : 'text-[var(--ivory-300)] hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Cinematic Video Lounge ({allReels.length} Videos)</span>
            </button>
          </div>
        </div>

        {/* MODE 1: Photographic Masonry Gallery */}
        {galleryMode === 'stills' && (
          <div>
            {/* Gallery Categories */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              {GALLERY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                    activeCat === cat.id
                      ? 'bg-[var(--brass-500)] text-[#0c0a08] font-semibold shadow-[0_0_15px_rgba(197,155,39,0.3)]'
                      : 'bg-[rgba(18,15,13,0.5)] border border-[var(--border-subtle)] text-[var(--ivory-muted)] hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Masonry / Dynamic Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[#120f0d] cursor-pointer shadow-lg hover:border-[var(--border-brass)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,8,7,0.92)] via-[rgba(10,8,7,0.2)] to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[rgba(10,8,7,0.7)] backdrop-blur-md border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brass-300)] opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-4 h-4" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded bg-[rgba(197,155,39,0.15)] text-[var(--brass-300)] text-[0.62rem] uppercase tracking-wider font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h4 className="font-display text-base text-[var(--ivory-50)] mb-1 leading-snug">
                        {item.title}
                      </h4>
                      <p className="font-editorial text-xs text-[var(--ivory-300)] italic line-clamp-1">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODE 2: Cinematic Video Lounge (All 14 Pinterest Video Reels) */}
        {galleryMode === 'reels' && (
          <div>
            {/* Video Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {[
                { id: 'all', label: `All Cinematic Reels (${allReels.length})` },
                { id: 'interior', label: `Interior Views (${PINTEREST_VIDEOS.interior.length})` },
                { id: 'kitchen', label: `Kitchen Theatre (${PINTEREST_VIDEOS.kitchen.length})` },
                { id: 'food', label: `Food & Plating (${PINTEREST_VIDEOS.food.length})` },
                { id: 'chef', label: `Chef Launch (${PINTEREST_VIDEOS.chef.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setVideoReelFilter(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                    videoReelFilter === tab.id
                      ? 'bg-[var(--brass-500)] text-[#0c0a08] font-bold shadow-md'
                      : 'bg-[rgba(18,15,13,0.6)] border border-[var(--border-subtle)] text-[var(--ivory-muted)] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Video Reels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredReels.map((reel) => (
                <div
                  key={reel.id}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[rgba(20,16,13,0.85)] backdrop-blur-md overflow-hidden p-4 shadow-xl hover:border-[var(--border-brass)] transition-all duration-300"
                >
                  <PinterestReelPlayer
                    videoId={reel.id}
                    title={reel.title}
                    category={reel.typeLabel}
                    maxHeight="480px"
                  />
                  <div className="pt-3 px-1">
                    <p className="text-xs text-[var(--ivory-300)] font-editorial italic">
                      “{reel.description}”
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox Modal for Stills */}
      {activeLightboxItem && (
        <div className="modal-backdrop">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(197,155,39,0.3)] text-white transition-all z-20"
            aria-label="Close image lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevLightbox}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(197,155,39,0.3)] text-white transition-all z-20"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextLightbox}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(197,155,39,0.3)] text-white transition-all z-20"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] flex flex-col items-center">
            <img
              src={activeLightboxItem.image}
              alt={activeLightboxItem.title}
              className="max-h-[70vh] w-auto object-contain rounded-lg border border-[var(--border-brass)] shadow-2xl mb-4"
            />
            <div className="text-center max-w-xl">
              <h3 className="font-display text-xl sm:text-2xl text-[var(--ivory-50)] mb-1">
                {activeLightboxItem.title}
              </h3>
              <p className="font-editorial text-sm sm:text-base text-[var(--ivory-300)] italic mb-2">
                “{activeLightboxItem.subtitle}”
              </p>
              <div className="flex justify-center gap-2">
                {activeLightboxItem.tags.map((t) => (
                  <span key={t} className="text-[0.68rem] text-[var(--brass-400)] font-mono uppercase tracking-widest">
                    ✦ {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
