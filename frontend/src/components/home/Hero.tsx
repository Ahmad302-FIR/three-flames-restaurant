import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChefHat,
  Star,
  MapPin,
  Utensils,
  List,
  ArrowRight,
  Calendar,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden bg-[#1C1815]">
      {/* Background Image: Authentic Pakistani Seekh Kebab & BBQ display */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=85&w=2400&auto=format&fit=crop"
          alt="Ahmed Khan Pakistani BBQ, Sajji & Seekh Kebabs"
          className="w-full h-full object-cover object-[80%_center] lg:object-right transform scale-105 filter brightness-[0.72] contrast-[1.08]"
        />

        {/* Directional warm charcoal gradient: Darker on left & center, softly fading right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(28,24,21,0.94) 0%, rgba(28,24,21,0.82) 40%, rgba(28,24,21,0.52) 70%, rgba(28,24,21,0.24) 100%)',
          }}
        />

        {/* Central warm radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 48% 50%, rgba(28,24,21,0.48) 0%, rgba(28,24,21,0.76) 55%, rgba(28,24,21,0.92) 100%)',
          }}
        />

        {/* Top and bottom warm fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1815] via-transparent to-[#1C1815]/80 pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
        {/* 1. Top Decorative Chef Hat + Accent Lines */}
        <div className="flex items-center justify-center gap-3.5 sm:gap-6 mb-3 sm:mb-4 lg:mb-5">
          <div className="h-[1.5px] w-14 sm:w-24 md:w-32 lg:w-36 bg-[#D6A15D] rounded-full" />
          <div className="text-[#D6A15D] flex items-center justify-center">
            <ChefHat size={38} strokeWidth={1.75} className="text-[#D6A15D] drop-shadow-md" />
          </div>
          <div className="h-[1.5px] w-14 sm:w-24 md:w-32 lg:w-36 bg-[#D6A15D] rounded-full" />
        </div>

        {/* 2. Brand Heading: "AHMED KHAN" (Warm Ivory, Elegant Serif) */}
        <h1 className="font-['Playfair_Display',Georgia,serif] text-4xl sm:text-6xl md:text-7xl lg:text-[5.4rem] xl:text-[6.2rem] font-bold tracking-[0.04em] sm:tracking-[0.05em] text-[#F3EDE5] uppercase leading-[0.98] drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
          AHMED KHAN
        </h1>

        {/* 3. Restaurant Heading: "RESTAURANT" (Soft Muted Gold, Noticeably Larger) */}
        <div className="font-['Playfair_Display',Georgia,serif] text-5xl sm:text-7xl md:text-8xl lg:text-[7.2rem] xl:text-[8.5rem] font-black tracking-[0.04em] sm:tracking-[0.06em] text-[#D6A15D] uppercase leading-[0.88] mt-0.5 sm:mt-1 drop-shadow-[0_4px_22px_rgba(0,0,0,0.85)]">
          RESTAURANT
        </div>

        {/* 4. Tagline: "WHERE TASTE MEETS FLAME" */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 mt-4 sm:mt-5 lg:mt-6 w-full max-w-2xl px-2">
          <div className="h-[1.5px] flex-1 max-w-[50px] sm:max-w-[80px] md:max-w-[100px] bg-[#D6A15D] rounded-full" />
          <span className="text-[#F3EDE5] font-bold text-xs sm:text-sm md:text-base lg:text-lg tracking-[0.22em] sm:tracking-[0.28em] uppercase whitespace-nowrap drop-shadow">
            WHERE TASTE MEETS FLAME
          </span>
          <div className="h-[1.5px] flex-1 max-w-[50px] sm:max-w-[80px] md:max-w-[100px] bg-[#D6A15D] rounded-full" />
        </div>

        {/* 5. Short Description */}
        <p className="mt-3.5 sm:mt-4 lg:mt-5 max-w-[720px] text-[#BDB1A5] text-xs sm:text-sm md:text-[0.95rem] lg:text-[1.02rem] leading-relaxed text-center px-4 font-normal drop-shadow">
          Authentic Pakistani BBQ, slow-roasted Balochi &amp; Peshawari Sajji,
          <br className="hidden md:inline" />
          sizzling Desi Ghee Karahi, and traditional skewers cooked over live charcoal embers.
        </p>

        {/* 6. Rating + Location Information Capsule */}
        <div className="mt-5 sm:mt-6 lg:mt-7 inline-flex items-center justify-center gap-2.5 sm:gap-3.5 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#FAF6EF] text-stone-900 shadow-xl shadow-black/30 border border-[#51463D]/40">
          <div className="flex items-center gap-1 text-[#D6A15D]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={15} fill="#D6A15D" strokeWidth={0} />
            ))}
          </div>
          <span className="font-bold text-[#1C1815] text-xs sm:text-sm md:text-[0.95rem]">4.9</span>
          <span className="text-[#57534E] font-medium text-xs sm:text-sm md:text-[0.95rem]">(3,800+ Reviews)</span>
          <span className="text-[#D6D0C7] select-none mx-0.5 sm:mx-1">|</span>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm md:text-[0.95rem] text-[#1C1815] font-semibold">
            <MapPin size={16} className="text-[#C97845] shrink-0" fill="#C97845" fillOpacity={0.25} />
            <span>University Town, Peshawar</span>
          </div>
        </div>

        {/* 7. Main CTA Buttons */}
        <div className="mt-6 sm:mt-7 lg:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full max-w-xl mx-auto">
          {/* LEFT BUTTON: Muted Terracotta */}
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="w-full sm:w-[245px] h-[52px] sm:h-[56px] px-8 rounded-full bg-[#C97845] hover:bg-[#E0AE6C] active:scale-[0.98] text-[#F3EDE5] font-semibold text-xs sm:text-sm tracking-wider uppercase inline-flex items-center justify-center gap-3 shadow-lg shadow-black/30 transition-all duration-300 cursor-pointer"
          >
            <Utensils size={18} className="text-[#F3EDE5] shrink-0" />
            <span>ORDER ONLINE</span>
            <ArrowRight size={18} className="text-[#F3EDE5] shrink-0" />
          </button>

          {/* RIGHT BUTTON: Cream/Off-white */}
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="w-full sm:w-[245px] h-[52px] sm:h-[56px] px-8 rounded-full bg-[#FAF6EF] hover:bg-white active:scale-[0.98] text-[#1C1815] font-semibold text-xs sm:text-sm tracking-wider uppercase inline-flex items-center justify-center gap-3 shadow-lg shadow-black/20 border border-[#51463D]/30 transition-all duration-300 cursor-pointer"
          >
            <List size={18} className="text-[#1C1815] shrink-0" />
            <span>VIEW FULL MENU</span>
            <ArrowRight size={18} className="text-[#1C1815] shrink-0" />
          </button>
        </div>

        {/* 8. Bottom Links */}
        <div className="mt-5 sm:mt-6 flex items-center justify-center gap-3.5 sm:gap-5 text-xs sm:text-sm font-medium">
          <button
            type="button"
            onClick={() => navigate('/reservation')}
            className="inline-flex items-center gap-1.5 text-[#F3EDE5] hover:text-[#D6A15D] transition-colors cursor-pointer group"
          >
            <Calendar size={15} className="text-[#D6A15D]" />
            <span className="underline underline-offset-4 decoration-[#F3EDE5]/50 group-hover:decoration-[#D6A15D]">
              Book A Table
            </span>
          </button>

          <span className="text-[#91857A] select-none">|</span>

          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="inline-flex items-center gap-1.5 text-[#F3EDE5] hover:text-[#D6A15D] transition-colors cursor-pointer group"
          >
            <MapPin size={15} className="text-[#D6A15D]" />
            <span className="underline underline-offset-4 decoration-[#F3EDE5]/50 group-hover:decoration-[#D6A15D]">
              Get Directions
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
