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
    <section className="relative min-h-[760px] lg:h-[840px] xl:h-[880px] flex items-center justify-center pt-[96px] sm:pt-[108px] lg:pt-[116px] pb-12 sm:pb-14 overflow-hidden bg-[#060B10]">
      {/* Background: Dark, moody deep-water texture with subtle stylized koi fish */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/hero-koi-bg.jpg"
          alt="Ahmed Khan Restaurant - Dark elegance with subtle koi fish and deep-water textures"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-center transform scale-100 filter brightness-[0.88] contrast-[1.10]"
        />

        {/* Focused warm central glow on text, contrasting with deep-blue-black water */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 48%, rgba(192, 104, 66, 0.09) 0%, rgba(6, 11, 16, 0.35) 45%, rgba(6, 11, 16, 0.78) 80%, rgba(6, 11, 16, 0.95) 100%)',
          }}
        />

        {/* Top seamless blend into dark Navbar */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#060B10]/95 via-[#060B10]/50 to-transparent pointer-events-none" />

        {/* Bottom subtle blend into next section */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#060B10] via-[#060B10]/60 to-transparent pointer-events-none" />
      </div>

      {/* Hero Content Container: Centered, clean, high-resolution and perfectly balanced */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
        {/* 1. Top Decorative Chef Hat Icon + Horizontal Accent Lines */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 mb-2.5 sm:mb-3.5 lg:mb-4">
          <div className="h-[1.5px] w-12 sm:w-20 md:w-28 lg:w-36 bg-[#C06842] rounded-full opacity-90" />
          <div className="text-[#C06842] flex items-center justify-center">
            <ChefHat size={38} strokeWidth={1.5} className="text-[#C06842] drop-shadow-[0_2px_10px_rgba(192,104,66,0.45)]" />
          </div>
          <div className="h-[1.5px] w-12 sm:w-20 md:w-28 lg:w-36 bg-[#C06842] rounded-full opacity-90" />
        </div>

        {/* 2. Brand Heading: "AHMED KHAN" (Cream Serif Font) */}
        <h1 className="font-['Playfair_Display',Georgia,serif] text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] xl:text-[5.8rem] font-bold tracking-[0.04em] sm:tracking-[0.05em] text-[#F5EFEB] uppercase leading-[0.98] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
          AHMED KHAN
        </h1>

        {/* 3. Restaurant Heading: "RESTAURANT" (Large Orange-Brown Font) */}
        <div className="font-['Playfair_Display',Georgia,serif] text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8rem] font-black tracking-[0.03em] sm:tracking-[0.04em] text-[#C06842] uppercase leading-[0.88] mt-0.5 sm:mt-1 drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)]">
          RESTAURANT
        </div>

        {/* 4. Tagline: "WHERE TASTE MEETS FLAME" */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 mt-4 sm:mt-5 lg:mt-6 w-full max-w-xl px-2">
          <div className="h-[1.5px] flex-1 max-w-[40px] sm:max-w-[70px] md:max-w-[90px] bg-[#C06842] rounded-full opacity-80" />
          <span className="text-[#F5EFEB] font-bold text-xs sm:text-sm md:text-[15px] lg:text-[16px] tracking-[0.24em] sm:tracking-[0.28em] uppercase whitespace-nowrap drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            WHERE TASTE MEETS FLAME
          </span>
          <div className="h-[1.5px] flex-1 max-w-[40px] sm:max-w-[70px] md:max-w-[90px] bg-[#C06842] rounded-full opacity-80" />
        </div>

        {/* 5. Descriptive Paragraph */}
        <p className="mt-3.5 sm:mt-4 lg:mt-5 max-w-[720px] text-[#E8E2DC] text-xs sm:text-sm md:text-[0.95rem] lg:text-[1.02rem] leading-relaxed text-center px-4 font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
          Authentic Pakistani BBQ, slow-roasted Balochi &amp; Peshawari Sajji,
          <br className="hidden sm:inline" />
          {' '}sizzling Desi Ghee Karahi, and traditional skewers cooked over live charcoal embers.
        </p>

        {/* 6. Unified White Rating Bubble with Orange Stars */}
        <div className="mt-5 sm:mt-6 lg:mt-7 inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 px-5 sm:px-7 py-2 sm:py-2.5 rounded-full bg-[#FFFDFC] text-[#25201D] shadow-[0_8px_30px_rgba(0,0,0,0.45)] border border-[#E8DED6] max-w-full">
          <div className="flex items-center gap-0.5 text-[#C06842]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={15} fill="#C06842" strokeWidth={0} />
            ))}
          </div>
          <span className="font-bold text-[#25201D] text-xs sm:text-sm">4.9</span>
          <span className="text-[#6F6761] font-medium text-xs sm:text-sm">(3,800+ Reviews)</span>
          <span className="text-[#E8DED6] select-none mx-0.5 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#25201D] font-semibold">
            <MapPin size={15} className="text-[#C06842] shrink-0" fill="#C06842" fillOpacity={0.25} />
            <span>University Town, Peshawar</span>
          </div>
        </div>

        {/* 7. Two Main CTA Buttons: Solid Orange-Brown Left, White Outline/Solid Right */}
        <div className="mt-6 sm:mt-7 lg:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full max-w-md sm:max-w-lg mx-auto">
          {/* Left Button: Solid Orange-Brown */}
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="w-full sm:w-[230px] h-[48px] sm:h-[52px] px-6 rounded-full bg-[#C06842] hover:bg-[#A85430] active:scale-[0.98] text-white font-bold text-xs sm:text-[13px] tracking-wider uppercase inline-flex items-center justify-center gap-2.5 shadow-[0_8px_24px_rgba(192,104,66,0.35)] transition-all duration-300 cursor-pointer"
          >
            <Utensils size={17} className="text-white shrink-0" />
            <span>ORDER ONLINE</span>
            <ArrowRight size={17} className="text-white shrink-0" />
          </button>

          {/* Right Button: White / Off-White */}
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="w-full sm:w-[230px] h-[48px] sm:h-[52px] px-6 rounded-full bg-[#FFFDFC] hover:bg-[#F5EFEB] active:scale-[0.98] text-[#25201D] font-bold text-xs sm:text-[13px] tracking-wider uppercase inline-flex items-center justify-center gap-2.5 shadow-[0_6px_20px_rgba(0,0,0,0.25)] border border-[#E8DED6] transition-all duration-300 cursor-pointer"
          >
            <List size={17} className="text-[#25201D] shrink-0" />
            <span>VIEW FULL MENU</span>
            <ArrowRight size={17} className="text-[#25201D] shrink-0" />
          </button>
        </div>

        {/* 8. Secondary Quick Links */}
        <div className="mt-4 sm:mt-5 flex items-center justify-center gap-3.5 sm:gap-5 text-xs sm:text-sm font-medium">
          <button
            type="button"
            onClick={() => navigate('/reservation')}
            className="inline-flex items-center gap-1.5 text-[#F5EFEB]/90 hover:text-[#C06842] transition-colors cursor-pointer group"
          >
            <Calendar size={14} className="text-[#C06842]" />
            <span className="underline underline-offset-4 decoration-[#F5EFEB]/40 group-hover:decoration-[#C06842]">
              Book A Table
            </span>
          </button>

          <span className="text-[#6F6761] select-none">|</span>

          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="inline-flex items-center gap-1.5 text-[#F5EFEB]/90 hover:text-[#C06842] transition-colors cursor-pointer group"
          >
            <MapPin size={14} className="text-[#C06842]" />
            <span className="underline underline-offset-4 decoration-[#F5EFEB]/40 group-hover:decoration-[#C06842]">
              Get Directions
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
