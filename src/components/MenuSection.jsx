import React, { useState } from 'react';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menuData';
import { Flame, Sparkles, Plus, Eye, Wine } from 'lucide-react';

export default function MenuSection({ onSelectDish, onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filterVegOnly, setFilterVegOnly] = useState(false);
  const [filterGlutenFree, setFilterGlutenFree] = useState(false);

  // Filter items
  const filteredDishes = MENU_ITEMS.filter((dish) => {
    if (activeCategory !== 'all' && dish.category !== activeCategory) return false;
    if (filterVegOnly && !dish.isVeg) return false;
    if (filterGlutenFree && !dish.isGlutenFree) return false;
    return true;
  });

  return (
    <section id="menu" className="relative py-28 bg-[var(--bg-secondary)] overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(197,155,39,0.06)_0%,transparent_70%)] pointer-events-none blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(194,94,46,0.05)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="section-container relative z-10">
        {/* Editorial Section Header */}
        <div className="section-header">
          <span className="section-eyebrow">The Culinary Repertoire</span>
          <h2 className="section-title">
            Artistry Across <span className="text-gold-gradient">Every Plate</span>
          </h2>
          <p className="section-description">
            Ancestral recipes elevated through single-estate spices, 36-hour copper simmerings, and fearless contemporary plating.
          </p>
          <div className="ornate-divider">
            <span className="ornate-divider-line" />
            <span className="ornate-diamond" />
            <span className="ornate-divider-line right" />
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-[0.8rem] font-medium tracking-wider uppercase transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-[var(--brass-500)] text-[#0c0a08] shadow-[0_4px_20px_rgba(197,155,39,0.4)] font-semibold'
                  : 'bg-[rgba(18,15,13,0.6)] border border-[var(--border-subtle)] text-[var(--ivory-300)] hover:text-white hover:border-[var(--brass-500)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dietary Filter Toggles */}
        <div className="flex items-center justify-center gap-4 mb-14 text-xs font-medium">
          <button
            onClick={() => setFilterVegOnly(!filterVegOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
              filterVegOnly
                ? 'bg-[rgba(46,125,50,0.2)] border-green-600 text-green-300 font-semibold'
                : 'border-[var(--border-subtle)] text-[var(--ivory-muted)] hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>Vegetarian Only</span>
          </button>

          <button
            onClick={() => setFilterGlutenFree(!filterGlutenFree)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
              filterGlutenFree
                ? 'bg-[rgba(197,155,39,0.2)] border-[var(--brass-500)] text-[var(--brass-200)] font-semibold'
                : 'border-[var(--border-subtle)] text-[var(--ivory-muted)] hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[var(--brass-400)]" />
            <span>Gluten-Free</span>
          </button>
        </div>

        {/* 3D Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              className="group relative rounded-lg border border-[var(--border-subtle)] bg-[rgba(24,20,17,0.85)] backdrop-blur-md overflow-hidden hover:border-[var(--border-brass)] transition-all duration-500 flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_15px_45px_rgba(0,0,0,0.8)]"
            >
              {/* Top Image Showcase */}
              <div
                onClick={() => onSelectDish(dish)}
                className="relative aspect-[16/10] overflow-hidden cursor-pointer"
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181411] via-transparent to-transparent opacity-80" />

                {/* Badge if present */}
                {dish.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[rgba(10,8,7,0.85)] border border-[var(--border-brass)] text-[var(--brass-300)] text-[0.65rem] font-bold tracking-widest uppercase">
                    {dish.badge}
                  </span>
                )}

                {/* Spice Meter */}
                {dish.spiceLevel > 0 && (
                  <div className="absolute top-3 right-3 flex items-center gap-0.5 px-2 py-1 rounded bg-[rgba(10,8,7,0.75)] backdrop-blur-md border border-[var(--border-subtle)]">
                    {Array.from({ length: dish.spiceLevel }).map((_, i) => (
                      <Flame key={i} className="w-3 h-3 text-[var(--saffron-500)]" />
                    ))}
                  </div>
                )}

                {/* Quick Explore Hint on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[rgba(10,8,7,0.4)]">
                  <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[rgba(197,155,39,0.9)] text-[#0c0a08] text-xs font-semibold uppercase tracking-wider shadow-lg">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Explore Dish</span>
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  {/* Devanagari Script & Category */}
                  <div className="flex items-center justify-between text-xs text-[var(--brass-400)] mb-1 font-editorial italic">
                    <span>{dish.devanagari}</span>
                    <span className="text-[var(--ivory-muted)] font-body text-[0.68rem] uppercase tracking-wider">
                      {dish.prepTime}
                    </span>
                  </div>

                  {/* Title & Price */}
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <h3
                      onClick={() => onSelectDish(dish)}
                      className="font-display text-xl text-[var(--ivory-50)] group-hover:text-[var(--brass-200)] transition-colors cursor-pointer leading-snug"
                    >
                      {dish.name}
                    </h3>
                    <span className="font-display text-lg text-[var(--brass-300)] font-semibold whitespace-nowrap">
                      {dish.currency}{dish.price}
                    </span>
                  </div>

                  {/* Short Description */}
                  <p className="text-[0.84rem] text-[var(--ivory-400)] font-body leading-relaxed mb-4">
                    {dish.shortDesc}
                  </p>
                </div>

                {/* Bottom Actions: Explore Detail & Quick Add */}
                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <button
                    onClick={() => onSelectDish(dish)}
                    className="text-xs uppercase tracking-wider text-[var(--brass-400)] hover:text-[var(--brass-200)] flex items-center gap-1 font-semibold group/btn"
                  >
                    <span>Inspect Profile</span>
                    <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                  </button>

                  <button
                    onClick={() => onAddToCart(dish)}
                    className="p-2 rounded-full border border-[var(--border-brass)] text-[var(--brass-300)] hover:bg-[var(--brass-500)] hover:text-[#0c0a08] transition-all"
                    title={`Add ${dish.name} to order`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
