import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function Footer({ onOpenReservation }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-[#070504] border-t border-[var(--border-subtle)] pt-20 pb-12 text-[var(--ivory-300)] overflow-hidden">
      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-[rgba(255,255,255,0.06)]">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full border border-[var(--brass-500)] flex items-center justify-center bg-[rgba(197,155,39,0.1)]">
                  <span className="font-display text-sm font-bold text-[var(--brass-300)] tracking-widest">
                    TR
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-xl text-[var(--ivory-50)] tracking-widest uppercase">
                    TISHA RESTRO
                  </h3>
                  <span className="text-[0.62rem] uppercase tracking-[0.25em] text-[var(--brass-400)] block font-mono">
                    The Art of Indian Dining
                  </span>
                </div>
              </div>

              <p className="text-xs text-[var(--ivory-muted)] font-editorial italic leading-relaxed max-w-sm mb-6">
                An award-level contemporary showcase honoring ancient Awadhi court recipes, Himalayan spices, and timeless sensory hospitality.
              </p>
            </div>

            <div className="text-[0.68rem] font-mono text-[var(--brass-400)]">
              ✦ Michelin Guide Featured Showcase • 2026
            </div>
          </div>

          {/* Quick Navigation (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-display text-sm text-[var(--ivory-50)] uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-[var(--ivory-muted)]">
              <li>
                <a href="#hero" className="hover:text-[var(--brass-300)] transition-colors">
                  Home Showcase
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[var(--brass-300)] transition-colors">
                  The Repertoire
                </a>
              </li>
              <li>
                <a href="#story" className="hover:text-[var(--brass-300)] transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-[var(--brass-300)] transition-colors">
                  The Experience
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[var(--brass-300)] transition-colors">
                  Visual Chronicle
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenReservation}
                  className="hover:text-[var(--brass-300)] transition-colors text-left"
                >
                  Reserve Table
                </button>
              </li>
            </ul>
          </div>

          {/* Hours & Enquiries (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-display text-sm text-[var(--ivory-50)] uppercase tracking-wider mb-4">
              Service Hours
            </h4>
            <div className="space-y-2 text-xs text-[var(--ivory-muted)] mb-4">
              <p>
                <strong className="text-[var(--ivory-200)]">Lunch:</strong> 12:00 PM – 3:30 PM
              </p>
              <p>
                <strong className="text-[var(--ivory-200)]">Dinner:</strong> 6:30 PM – 11:30 PM
              </p>
              <p className="pt-2 text-[var(--brass-400)] font-editorial italic">
                Valet attendance throughout all services.
              </p>
            </div>
            <div className="text-xs text-[var(--ivory-muted)]">
              <span className="block text-[var(--ivory-200)] font-medium">Direct Inquiries:</span>
              <span>concierge@tisharestro.com</span>
            </div>
          </div>

          {/* Epicurean Club Newsletter (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-display text-sm text-[var(--ivory-50)] uppercase tracking-wider mb-4">
              The Tasting Club
            </h4>
            <p className="text-xs text-[var(--ivory-muted)] font-editorial italic mb-4">
              Receive private invitations to seasonal imperial tasting menus and sommelier cellar releases.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[var(--border-subtle)] focus:border-[var(--brass-400)] rounded px-3 py-2.5 text-xs text-white placeholder-[var(--ivory-muted)] focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-[var(--brass-300)] hover:text-white"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-[0.68rem] text-green-400 font-mono">
                  <Check className="w-3 h-3" />
                  <span>Welcome to the Imperial Table.</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Legal & Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--ivory-muted)] gap-4">
          <p>© {new Date().getFullYear()} TISHA RESTRO. Fictional Showcase Portfolio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#hero" className="hover:text-[var(--brass-300)] transition-colors">
              Privacy Policy
            </a>
            <a href="#hero" className="hover:text-[var(--brass-300)] transition-colors">
              Terms of Hospitality
            </a>
            <a href="#hero" className="hover:text-[var(--brass-300)] transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
