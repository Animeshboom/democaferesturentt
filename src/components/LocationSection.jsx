import { MapPin, Clock, Phone, Mail, Compass, Car, Sparkles, Navigation } from 'lucide-react';

export default function LocationSection({ onReserve }) {
  return (
    <section id="location" className="relative py-28 bg-[var(--bg-primary)] overflow-hidden">
      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-eyebrow">Sanctuary & Arrival</span>
          <h2 className="section-title">
            Visit <span className="text-gold-gradient">Tisha Restro</span>
          </h2>
          <p className="section-description">
            Situated within the heritage enclave, welcoming connoisseurs of Indian gastronomy daily.
          </p>
          <div className="ornate-divider">
            <span className="ornate-divider-line" />
            <span className="ornate-diamond" />
            <span className="ornate-divider-line right" />
          </div>
        </div>

        {/* Location Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Cards: Hours, Valet & Direct Contacts (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Address & Porte-Cochere */}
            <div className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[rgba(20,16,13,0.8)] backdrop-blur-md">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-[var(--brass-400)] shrink-0" />
                <h4 className="font-display text-base text-[var(--ivory-50)]">The Royal Heritage Enclave</h4>
              </div>
              <p className="text-sm text-[var(--ivory-300)] font-editorial italic ml-8 mb-4">
                42 Royal Crescent Heritage Pavilion, Victoria Enclave, Central City
              </p>
              <div className="flex items-center gap-2 ml-8 text-xs text-[var(--brass-300)]">
                <Car className="w-4 h-4" />
                <span>Complimentary White-Glove Valet Parking</span>
              </div>
            </div>

            {/* Service Timings */}
            <div className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[rgba(20,16,13,0.8)] backdrop-blur-md">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-[var(--brass-400)] shrink-0" />
                <h4 className="font-display text-base text-[var(--ivory-50)]">Service Seatings</h4>
              </div>
              <div className="space-y-3 ml-8 text-xs text-[var(--ivory-300)] font-body">
                <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-[var(--brass-300)] font-semibold">Afternoon Lunch</span>
                  <span>12:00 PM – 3:30 PM (Daily)</span>
                </div>
                <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-[var(--brass-300)] font-semibold">Evening Dinner</span>
                  <span>6:30 PM – 11:30 PM (Daily)</span>
                </div>
                <div className="flex justify-between pt-1 text-[var(--ivory-muted)]">
                  <span>Dress Code:</span>
                  <span className="text-white">Smart Elegant Evening</span>
                </div>
              </div>
            </div>

            {/* Direct Concierge Line */}
            <div className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[rgba(20,16,13,0.8)] backdrop-blur-md flex items-center justify-between">
              <div className="flex flex-col gap-1 text-left">
                <span className="text-[0.68rem] tracking-wider uppercase text-[var(--brass-400)] font-mono">
                  Concierge Desk
                </span>
                <a
                  href="tel:+917008665245"
                  className="font-display text-lg text-[var(--ivory-50)] hover:text-[var(--brass-300)] transition-colors"
                >
                  +91 70086 65245
                </a>
                <a
                  href="mailto:maitre-d@tisharestro.com"
                  className="text-xs text-[var(--ivory-muted)] hover:text-white font-editorial italic"
                >
                  maitre-d@tisharestro.com
                </a>
              </div>
              <button
                onClick={onReserve}
                className="btn-brass-primary !py-2.5 !px-5 text-xs"
              >
                <span>Book Table</span>
              </button>
            </div>
          </div>

          {/* Right: Custom Luxury Vector Map (7 cols) */}
          <div className="lg:col-span-7 relative rounded-lg border border-[var(--border-brass)] overflow-hidden shadow-2xl bg-[#0d0a08] min-h-[420px] flex flex-col justify-between p-6 sm:p-8">
            {/* Map Background Aesthetics */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c59b27" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Curved artistic river / boulevard line */}
                <path
                  d="M0,250 C180,180 320,380 500,280 C680,180 800,320 1000,240"
                  fill="none"
                  stroke="#c59b27"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>
            </div>

            {/* Top Map Header */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--brass-400)] animate-ping" />
                <span className="text-xs uppercase tracking-widest text-[var(--brass-400)] font-mono">
                  Coordinates: 28°36'51.2"N 77°12'18.4"E
                </span>
              </div>
              <span className="px-3 py-1 rounded bg-[rgba(197,155,39,0.15)] text-[var(--brass-300)] text-[0.68rem] uppercase font-mono">
                Porte-Cochère Open
              </span>
            </div>

            {/* Central Landmark Marker */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-12">
              <div className="relative w-16 h-16 rounded-full border-2 border-[var(--brass-500)] flex items-center justify-center bg-[rgba(18,15,13,0.9)] shadow-[0_0_35px_rgba(197,155,39,0.5)] mb-3">
                <Navigation className="w-7 h-7 text-[var(--brass-400)]" />
              </div>
              <h4 className="font-display text-xl text-[var(--ivory-50)] mb-1">
                TISHA RESTRO MAIN ENTRANCE
              </h4>
              <p className="font-editorial text-sm text-[var(--brass-300)] italic mb-4">
                Victoria Enclave Pavilion • West Wing Grand Courtyard
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-brass text-xs !py-2 !px-6 flex items-center gap-2"
              >
                <Compass className="w-3.5 h-3.5 text-[var(--brass-400)]" />
                <span>Open in Google Maps Navigation</span>
              </a>
            </div>

            {/* Bottom info strip */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-[rgba(197,155,39,0.2)] text-[0.72rem] text-[var(--ivory-muted)] font-mono">
              <span>Adjacent to The Royal Botanical Gardens</span>
              <span className="text-[var(--brass-400)]">Chauffeur Lounge Available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
