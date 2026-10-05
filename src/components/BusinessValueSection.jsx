import React from 'react';
import { Sparkles, TrendingUp, Compass, HeartHandshake, ShieldCheck, Smartphone, Globe } from 'lucide-react';

export default function BusinessValueSection() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'More Direct Enquiries',
      desc: 'Eliminate friction with integrated WhatsApp concierge and zero-commission direct bookings.'
    },
    {
      icon: Compass,
      title: 'Sensory Brand Anticipation',
      desc: '3D food worlds and 360° table scenes build appetite before guests even step through the door.'
    },
    {
      icon: ShieldCheck,
      title: 'Uncompromised Brand Prestige',
      desc: 'An award-level digital flagship that matches the caliber of your Michelin or royal kitchen.'
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Hospitality',
      desc: 'Silky smooth mobile touch drag, instant table booking, and effortless digital ordering.'
    },
    {
      icon: Globe,
      title: 'Global Cultural Appeal',
      desc: 'Honours authentic Indian culinary heritage with modern international luxury aesthetics.'
    },
    {
      icon: HeartHandshake,
      title: 'Higher Table Retention',
      desc: 'Converts casual menu browsers into loyal repeat patrons through emotional storytelling.'
    }
  ];

  return (
    <section className="relative py-28 bg-[var(--bg-secondary)] overflow-hidden border-t border-[var(--border-subtle)]">
      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-eyebrow">The Digital Philosophy</span>
          <h2 className="section-title">
            Your restaurant deserves <br />
            <span className="text-gold-gradient">more than a menu link.</span>
          </h2>
          <p className="section-description">
            In an era of fleeting attention, extraordinary hospitality begins long before the first course is served.
          </p>
          <div className="ornate-divider">
            <span className="ornate-divider-line" />
            <span className="ornate-diamond" />
            <span className="ornate-divider-line right" />
          </div>
        </div>

        {/* 6-Pillar Value Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-lg border border-[var(--border-subtle)] bg-[rgba(18,15,13,0.7)] backdrop-blur-md hover:border-[var(--border-brass)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_35px_rgba(0,0,0,0.8)]"
              >
                <div className="w-12 h-12 rounded-full border border-[var(--brass-500)] flex items-center justify-center bg-[rgba(197,155,39,0.1)] mb-5">
                  <Icon className="w-5 h-5 text-[var(--brass-300)]" />
                </div>
                <h4 className="font-display text-lg text-[var(--ivory-50)] mb-2">{b.title}</h4>
                <p className="text-[0.88rem] text-[var(--ivory-400)] font-body leading-relaxed">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
