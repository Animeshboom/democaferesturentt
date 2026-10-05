import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Sparkles, Calendar } from 'lucide-react';
import AudioAtmosphere from './AudioAtmosphere';

export default function Navbar({
  cartCount = 0,
  onOpenCart,
  onOpenReservation,
  onOpenConcierge
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Menu', href: '#menu' },
    { label: 'Our Story', href: '#story' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#location' }
  ];

  return (
    <>
      <header className={`luxury-navbar ${isScrolled ? 'scrolled' : 'top'}`}>
        <div className="section-container flex items-center justify-between w-full">
          {/* Brand Mark & Typography */}
          <a href="#hero" className="nav-brand-link">
            <div className="nav-brand-badge">
              <span>TR</span>
            </div>
            <div className="flex flex-col">
              <span className="nav-brand-title">TISHA RESTRO</span>
              <span className="nav-brand-sub">The Art of Indian Dining</span>
            </div>
          </a>

          {/* Desktop Navigation Links (Hidden on < 1024px) */}
          <nav className="hidden lg:flex" id="desktop-nav-container">
            <ul className="nav-menu-list">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="nav-menu-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Right Action Cluster (Hidden on < 768px via CSS) */}
          <div className="nav-actions-desktop">
            {/* Audio Ambience Toggle */}
            <AudioAtmosphere />

            {/* AI Concierge Trigger */}
            <button
              onClick={onOpenConcierge}
              className="nav-pill-btn"
              title="Open Tisha AI Dining Concierge"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--brass-400)] animate-pulse" />
              <span>Concierge</span>
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="nav-icon-btn relative"
              title="View Tasting Cart"
              aria-label="View Tasting Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--brass-500)] text-[#0a0807] text-[0.6rem] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(197,155,39,0.6)]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Primary CTA: Reserve a Table */}
            <button
              onClick={onOpenReservation}
              className="btn-nav-reserve"
              title="Book your dining table"
            >
              <Calendar className="w-3.5 h-3.5 text-[var(--brass-300)]" />
              <span>Reserve a Table</span>
            </button>
          </div>

          {/* Mobile Right Bar (Cart + Hamburger Button) */}
          <div className="nav-mobile-toggle items-center gap-2">
            <button
              onClick={onOpenCart}
              className="nav-icon-btn relative"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[var(--brass-500)] text-[#0a0807] text-[0.55rem] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="nav-icon-btn"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[var(--brass-300)]" />
              ) : (
                <Menu className="w-5 h-5 text-[var(--brass-300)]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          {/* Close Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <div className="nav-brand-badge !w-7 !h-7 !text-xs">
                <span>TR</span>
              </div>
              <span className="font-display text-sm text-[var(--ivory-50)] tracking-widest uppercase">
                TISHA RESTRO
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full border border-[var(--border-subtle)] text-[var(--brass-300)] hover:text-white"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links List */}
          <div className="flex flex-col gap-5 my-auto py-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-display text-2xl uppercase tracking-widest text-[var(--ivory-100)] hover:text-[var(--brass-300)] transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action CTAs in Mobile Drawer */}
          <div className="flex flex-col gap-3 pt-4 border-t border-[var(--border-subtle)]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConcierge();
              }}
              className="btn-outline-brass w-full justify-center !py-3 text-xs"
            >
              <Sparkles className="w-4 h-4 text-[var(--brass-400)]" />
              <span>Tisha AI Concierge (Maître d')</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReservation();
              }}
              className="btn-brass-primary w-full justify-center !py-3 text-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve a Table</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
