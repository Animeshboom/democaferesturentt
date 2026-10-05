import React, { useState } from 'react';
import { X, Flame, Wine, Clock, Sparkles, Plus, Minus, MessageCircle, ShoppingBag, Check } from 'lucide-react';

export default function DishDetailModal({ dish, onClose, onAddToCart }) {
  const [selectedSpice, setSelectedSpice] = useState(dish?.spiceLevel || 1);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!dish) return null;

  const spiceLabels = ['Delicate & Fragrant', 'Royal Warmth', 'Historic Court Heat'];

  const handleAdd = () => {
    onAddToCart({
      ...dish,
      customSpice: selectedSpice,
      quantity,
      specialNotes: notes
    });
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  const handleWhatsAppEnquiry = () => {
    const text = encodeURIComponent(
      `Hello Tisha Restro, I would like to inquire about "${dish.name}" (${dish.currency}${dish.price}). Could you tell me more about table reservations or pairing options?`
    );
    window.open(`https://wa.me/917008665245?text=${text}`, '_blank');
  };

  return (
    <div className="modal-backdrop">
      <div className="relative w-full max-w-4xl my-auto rounded-xl modal-container-card overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-[rgba(18,15,13,0.7)] text-[var(--ivory-200)] hover:text-white hover:bg-[rgba(197,155,39,0.3)] transition-all border border-[var(--border-subtle)]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Column: Visual Showcase */}
          <div className="md:col-span-5 relative bg-[#0a0807] overflow-hidden min-h-[300px] md:min-h-[500px]">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14100e] via-transparent to-transparent" />

            {/* Badge & Dietary Pill */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {dish.badge && (
                <span className="px-3 py-1 rounded bg-[rgba(197,155,39,0.9)] text-[#0c0a08] text-[0.7rem] font-bold tracking-wider uppercase shadow-md">
                  {dish.badge}
                </span>
              )}
              <span
                className={`px-2.5 py-0.5 rounded text-[0.68rem] font-medium tracking-wide uppercase ${
                  dish.isVeg
                    ? 'bg-[rgba(46,125,50,0.85)] text-white'
                    : 'bg-[rgba(198,40,40,0.85)] text-white'
                }`}
              >
                {dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
            </div>

            {/* Pairing Advice Card at Bottom */}
            {dish.pairing && (
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded bg-[rgba(18,15,13,0.85)] backdrop-blur-md border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2 text-[var(--brass-400)] text-xs mb-1">
                  <Wine className="w-3.5 h-3.5" />
                  <span className="font-semibold uppercase tracking-wider text-[0.68rem]">Sommelier Pairing</span>
                </div>
                <p className="font-editorial text-xs text-[var(--ivory-200)] italic">{dish.pairing}</p>
              </div>
            )}
          </div>

          {/* Right Column: Culinary Details & Order Controls */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Devanagari Script & Category */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-editorial text-sm text-[var(--brass-400)] tracking-wide">
                  {dish.devanagari}
                </span>
                <span className="flex items-center gap-1 text-xs text-[var(--ivory-muted)]">
                  <Clock className="w-3.5 h-3.5 text-[var(--brass-500)]" />
                  <span>{dish.prepTime}</span>
                </span>
              </div>

              {/* Title & Price */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-display text-2xl sm:text-3xl text-[var(--ivory-50)] leading-tight">
                  {dish.name}
                </h3>
                <span className="font-display text-2xl text-[var(--brass-300)] font-semibold whitespace-nowrap">
                  {dish.currency}{dish.price}
                </span>
              </div>

              {/* Detailed Description */}
              <p className="text-[0.88rem] text-[var(--ivory-300)] font-body leading-relaxed mb-6">
                {dish.fullDesc}
              </p>

              {/* Exploded Ingredients Section */}
              <div className="mb-6 p-4 rounded bg-[rgba(18,15,13,0.6)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[var(--brass-400)] mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ancestral Ingredient Profile</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {dish.explodedIngredients.map((item, idx) => (
                    <div key={idx} className="flex flex-col text-xs">
                      <span className="text-[var(--ivory-100)] font-medium">✦ {item.name}</span>
                      <span className="text-[var(--ivory-muted)] font-editorial italic text-[0.75rem]">
                        {item.note}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasting Note */}
              <div className="mb-6 text-xs text-[var(--ivory-400)] border-l-2 border-[var(--brass-500)] pl-3 py-1 font-editorial italic text-sm">
                “{dish.tastingNotes}”
              </div>

              {/* Interactive Spice Level Selection */}
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest text-[var(--brass-400)] font-semibold mb-2">
                  Spice Intensity: {spiceLabels[selectedSpice]}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedSpice(lvl)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded text-xs transition-all border ${
                        selectedSpice === lvl
                          ? 'bg-[rgba(197,155,39,0.2)] border-[var(--brass-500)] text-[var(--brass-200)] font-semibold'
                          : 'bg-[rgba(18,15,13,0.5)] border-[var(--border-subtle)] text-[var(--ivory-muted)] hover:text-white'
                      }`}
                    >
                      <div className="flex">
                        {Array.from({ length: lvl + 1 }).map((_, i) => (
                          <Flame key={i} className="w-3 h-3 text-[var(--saffron-500)]" />
                        ))}
                      </div>
                      <span>{lvl === 0 ? 'Mild' : lvl === 1 ? 'Royal' : 'Heritage'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between mb-6 pt-4 border-t border-[var(--border-subtle)]">
                <span className="text-xs uppercase tracking-wider text-[var(--ivory-300)] font-medium">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded border border-[var(--border-subtle)] flex items-center justify-center text-[var(--ivory-200)] hover:border-[var(--brass-500)] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-display text-lg text-white w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded border border-[var(--border-subtle)] flex items-center justify-center text-[var(--ivory-200)] hover:border-[var(--brass-500)] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Add to Order & WhatsApp Inquiry */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[var(--border-subtle)]">
              <button
                onClick={handleAdd}
                className="btn-brass-primary flex-1 !py-3 flex items-center justify-center gap-2"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-black" />
                    <span>Added to Order</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Order • {dish.currency}{dish.price * quantity}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleWhatsAppEnquiry}
                className="btn-outline-brass !py-3 flex items-center justify-center gap-2"
                title="Inquire on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
