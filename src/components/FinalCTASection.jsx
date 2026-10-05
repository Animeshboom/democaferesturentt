import React from 'react';
import { Calendar, ArrowRight, MessageCircle, Sparkles } from 'lucide-react';

export default function FinalCTASection({ onReserveTable, onExploreMenu }) {
  const handleWhatsAppUs = () => {
    const text = encodeURIComponent(
      'Namaste Tisha Restro, I would like to inquire about reserving a table or hosting a private dinner.'
    );
    window.open(`https://wa.me/917008665245?text=${text}`, '_blank');
  };

  return (
    <section className="relative min-h-[90vh] py-28 flex items-center justify-center overflow-hidden bg-[#080605]">
      {/* Background Cinematic Food Plating Canvas / Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/ambience_dining.jpg"
          alt="Tisha Restro Dining Hall Sunset"
          className="w-full h-full object-cover transform scale-105 filter brightness-40"
        />
        {/* Layered cinematic gradient vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0807] via-[rgba(10,8,7,0.7)] to-[#0a0807]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,155,39,0.15)_0%,transparent_65%)]" />
      </div>

      <div className="section-container relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        {/* Sacred emblem */}
        <div className="w-16 h-16 rounded-full border border-[var(--brass-500)] flex items-center justify-center bg-[rgba(197,155,39,0.15)] shadow-[0_0_35px_rgba(197,155,39,0.4)] mb-6 animate-pulse">
          <Sparkles className="w-7 h-7 text-[var(--brass-300)]" />
        </div>

        <span className="text-xs uppercase tracking-[0.3em] font-mono text-[var(--brass-400)] mb-3 block">
          The Grand Finale
        </span>

        {/* Master Headline */}
        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl text-[var(--ivory-50)] tracking-tight leading-tight mb-6">
          Your table is <span className="text-gold-gradient italic">waiting.</span>
        </h2>

        {/* Supporting Quote */}
        <p className="font-editorial text-2xl sm:text-3xl text-[var(--ivory-200)] italic max-w-2xl leading-relaxed mb-10">
          “Come for the flavour. Stay for the experience.”
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <button
            onClick={onReserveTable}
            className="btn-brass-primary !py-4 !px-8 text-sm group"
          >
            <Calendar className="w-4 h-4 text-black" />
            <span>Reserve Your Table</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href="#menu"
            onClick={onExploreMenu}
            className="btn-outline-brass !py-4 !px-8 text-sm"
          >
            <span>Explore the Menu</span>
          </a>

          <button
            onClick={handleWhatsAppUs}
            className="flex items-center gap-2 px-6 py-4 rounded-sm bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 transition-all text-xs font-semibold uppercase tracking-wider"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Us</span>
          </button>
        </div>

        <span className="text-xs text-[var(--ivory-muted)] font-editorial italic tracking-wider">
          ✦ Complimentary Valet • Tailored Sommelier Service • Bespoke Royal Feasts
        </span>
      </div>
    </section>
  );
}
