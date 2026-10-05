import React from 'react';
import { REVIEWS_OVERVIEW, CRITIC_REVIEWS } from '../data/reviewsData';
import { Star, Award, ShieldCheck, Quote } from 'lucide-react';

export default function ReviewsSection() {
  return (
    <section className="relative py-28 overflow-hidden" style={{ backgroundColor: '#0a0807' }}>
      {/* Opulent Pinterest Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/images/reviews_bg.jpg"
          alt="Gastronomic Acclaim Dining Background"
          className="w-full h-full object-cover opacity-20 scale-105 filter blur-[2px]"
          style={{ objectPosition: 'center 40%' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #0a0807 0%, rgba(10,8,7,0.85) 20%, rgba(10,8,7,0.78) 50%, rgba(10,8,7,0.92) 85%, #0a0807 100%)'
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(circle,rgba(197,155,39,0.14)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-eyebrow">Gastronomic Acclaim</span>
          <h2 className="section-title">
            Words from <span className="text-gold-gradient">The Table</span>
          </h2>
          <p className="section-description">
            Reflections from respected culinary journals and patrons who have journeyed through our dining rooms.
          </p>
          <div className="ornate-divider">
            <span className="ornate-divider-line" />
            <span className="ornate-diamond" />
            <span className="ornate-divider-line right" />
          </div>
        </div>

        {/* Master Rating Overview Banner */}
        <div className="max-w-2xl mx-auto mb-16 p-6 rounded-xl border border-[var(--border-brass)] bg-[rgba(20,16,13,0.8)] backdrop-blur-md text-center shadow-xl">
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-5 h-5 fill-[var(--brass-400)] text-[var(--brass-400)]" />
            ))}
          </div>

          <div className="font-display text-4xl text-[var(--ivory-50)] font-bold mb-1">
            {REVIEWS_OVERVIEW.averageRating} <span className="text-base text-[var(--ivory-muted)] font-normal">/ 5.0</span>
          </div>

          <blockquote className="font-editorial text-lg text-[var(--ivory-200)] italic mb-3">
            {REVIEWS_OVERVIEW.critiqueQuote}
          </blockquote>

          <div className="flex items-center justify-center gap-2 text-xs text-[var(--brass-400)] font-mono uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>{REVIEWS_OVERVIEW.source}</span>
          </div>

          <p className="mt-3 text-[0.65rem] text-[var(--ivory-muted)] font-mono">
            ✦ {REVIEWS_OVERVIEW.demoNote}
          </p>
        </div>

        {/* 3D Floating Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CRITIC_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[rgba(26,21,18,0.7)] backdrop-blur-md flex flex-col justify-between hover:border-[var(--border-brass)] hover:-translate-y-2 hover:shadow-[0_12px_35px_rgba(0,0,0,0.8)] transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[var(--brass-400)] text-[var(--brass-400)]" />
                    ))}
                  </div>
                  <span className="text-[0.65rem] text-[var(--brass-400)] font-mono uppercase tracking-widest">
                    {rev.tag}
                  </span>
                </div>

                <Quote className="w-6 h-6 text-[var(--brass-600)] mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />

                <p className="font-editorial text-[0.98rem] text-[var(--ivory-200)] italic leading-relaxed mb-6">
                  “{rev.quote}”
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <h4 className="font-display text-sm text-[var(--ivory-50)]">{rev.author}</h4>
                  <span className="text-[0.72rem] text-[var(--ivory-muted)] block font-body">
                    {rev.outlet}
                  </span>
                </div>
                {rev.verified && (
                  <ShieldCheck className="w-4 h-4 text-[var(--brass-500)]" title="Verified Diner" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
