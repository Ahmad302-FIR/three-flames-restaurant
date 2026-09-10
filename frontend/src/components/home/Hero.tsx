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
    <section className="relative min-h-[720px] lg:h-[780px] xl:h-[820px] flex items-center justify-center pt-[88px] sm:pt-[98px] lg:pt-[104px] pb-10 sm:pb-12 overflow-hidden bg-[#140E0B]">
      {/* Background: Authentic Pakistani BBQ Seekh Kebabs & rustic dining setting from reference image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/hero-bbq-bg.jpg"
          alt="Ahmed Khan Restaurant - Authentic Pakistani BBQ, Sajji & Karahi"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-[50%_center] transform scale-100 filter brightness-[0.92] contrast-[1.05]"
        />

        {/* Central darkening vignette to ensure 100% crisp typography readability while keeping kebabs and chutney vivid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(20, 14, 11, 0.68) 0%, rgba(20, 14, 11, 0.45) 50%, rgba(20, 14, 11, 0.15) 85%, rgba(10, 7, 5, 0.35) 100%)',
          }}
        />

        {/* Top blend for seamless navigation bar integration */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#140E0B]/80 via-[#140E0B]/35 to-transparent pointer-events-none" />

        {/* Bottom subtle fade */}
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#140E0B]/60 to-transparent pointer-events-none" />
      </div>

      {/* Hero Content Container: Centered, clean, perfectly matching reference composition */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
        {/* 1. Top Decorative Chef Hat Icon + Horizontal Accent Lines */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 mb-2 sm:mb-3">
          <div className="h-[1.5px] w-12 sm:w-20 md:w-28 lg:w-32 bg-[#C25834] rounded-full opacity-90" />
          <div className="text-[#C25834] flex items-center justify-center">
            <ChefHat size={34} strokeWidth={1.5} className="text-[#C25834] drop-shadow" />
          </div>
          <div className="h-[1.5px] w-12 sm:w-20 md:w-28 lg:w-32 bg-[#C25834] rounded-full opacity-90" />
        </div>

        {/* 2. Brand Heading: "AHMED KHAN" (Cream Serif Font) */}
        <h1 className="font-['Playfair_Display',Georgia,serif] text-4xl sm:text-6xl md:text-7xl lg:text-[5.4rem] xl:text-[6.2rem] font-bold tracking-[0.03em] text-[#FFFDFC] uppercase leading-[0.96] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
          AHMED KHAN
        </h1>

        {/* 3. Restaurant Heading: "RESTAURANT" (Large Warm Terracotta-Orange Font) */}
        <div className="font-['Playfair_Display',Georgia,serif] text-5xl sm:text-7xl md:text-8xl lg:text-[6.8rem] xl:text-[7.8rem] font-black tracking-[0.02em] sm:tracking-[0.03em] text-[#C25834] uppercase leading-[0.88] mt-0.5 sm:mt-1 drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
          RESTAURANT
        </div>

        {/* 4. Tagline: "WHERE TASTE MEETS FLAME" */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-4 lg:mt-5 w-full max-w-xl px-2">
          <div className="h-[1.5px] flex-1 max-w-[40px] sm:max-w-[70px] md:max-w-[90px] bg-[#C25834] rounded-full opacity-85" />
          <span className="text-[#FFFDFC] font-bold text-xs sm:text-sm md:text-[15px] lg:text-[16px] tracking-[0.22em] sm:tracking-[0.28em] uppercase whitespace-nowrap drop-shadow">
            WHERE TASTE MEETS FLAME
          </span>
          <div className="h-[1.5px] flex-1 max-w-[40px] sm:max-w-[70px] md:max-w-[90px] bg-[#C25834] rounded-full opacity-85" />
        </div>

        {/* 5. Descriptive Paragraph */}
        <p className="mt-3 sm:mt-3.5 lg:mt-4 max-w-[680px] text-[#FFFDFC] text-xs sm:text-sm md:text-[0.92rem] lg:text-[0.98rem] leading-relaxed text-center px-4 font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          Authentic Pakistani BBQ, slow-roasted Balochi &amp; Peshawari Sajji,
          <br className="hidden sm:inline" />
          {' '}sizzling Desi Ghee Karahi, and traditional skewers cooked over live charcoal embers.
        </p>

        {/* 6. Unified White Rating Bubble with Orange Stars */}
        <div className="mt-4 sm:mt-5 lg:mt-6 inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#FFFDFC] text-[#25201D] shadow-[0_4px_20px_rgba(0,0,0,0.35)] border border-[#E8DED6]/80 max-w-full">
          <div className="flex items-center gap-0.5 text-[#C25834]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="#C25834" strokeWidth={0} />
            ))}
          </div>
          <span className="font-bold text-[#25201D] text-xs sm:text-sm">4.9</span>
          <span className="text-[#6F6761] font-medium text-xs sm:text-sm">(3,800+ Reviews)</span>
          <span className="text-[#D8CEC6] select-none mx-0.5 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#25201D] font-medium">
            <MapPin size={15} className="text-[#C25834] shrink-0" fill="#C25834" fillOpacity={0.25} />
            <span>University Town, Peshawar</span>
          </div>
        </div>

        {/* 7. Two Main CTA Buttons: Solid Orange-Brown Left, White Solid Pill Right */}
        <div className="mt-5 sm:mt-6 lg:mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-lg mx-auto">
          {/* Left Button: Solid Terracotta */}
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="w-full sm:w-[220px] h-[48px] sm:h-[50px] px-6 rounded-full bg-[#C25834] hover:bg-[#A84524] active:scale-[0.98] text-white font-bold text-xs sm:text-[13px] tracking-wider uppercase inline-flex items-center justify-center gap-2.5 shadow-[0_6px_20px_rgba(194,88,52,0.4)] transition-all duration-300 cursor-pointer"
          >
            <Utensils size={16} className="text-white shrink-0" />
            <span>ORDER ONLINE</span>
            <ArrowRight size={16} className="text-white shrink-0" />
          </button>

          {/* Right Button: White / Ivory Solid Pill */}
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="w-full sm:w-[220px] h-[48px] sm:h-[50px] px-6 rounded-full bg-[#FFFDFC] hover:bg-[#F7F3EE] active:scale-[0.98] text-[#25201D] font-bold text-xs sm:text-[13px] tracking-wider uppercase inline-flex items-center justify-center gap-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.25)] border border-[#E8DED6] transition-all duration-300 cursor-pointer"
          >
            <List size={16} className="text-[#25201D] shrink-0" />
            <span>VIEW FULL MENU</span>
            <ArrowRight size={16} className="text-[#25201D] shrink-0" />
          </button>
        </div>

        {/* 8. Secondary Quick Links */}
        <div className="mt-4 sm:mt-5 flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-[13px] font-medium">
          <button
            type="button"
            onClick={() => navigate('/reservation')}
            className="inline-flex items-center gap-1.5 text-[#FFFDFC] hover:text-[#C25834] transition-colors cursor-pointer group"
          >
            <Calendar size={14} className="text-[#C25834]" />
            <span className="underline underline-offset-4 decoration-[#FFFDFC]/50 group-hover:decoration-[#C25834]">
              Book A Table
            </span>
          </button>

          <span className="text-[#C25834]/60 select-none">|</span>

          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="inline-flex items-center gap-1.5 text-[#FFFDFC] hover:text-[#C25834] transition-colors cursor-pointer group"
          >
            <MapPin size={14} className="text-[#C25834]" />
            <span className="underline underline-offset-4 decoration-[#FFFDFC]/50 group-hover:decoration-[#C25834]">
              Get Directions
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
