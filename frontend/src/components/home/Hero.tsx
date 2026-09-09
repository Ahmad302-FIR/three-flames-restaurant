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
    <section className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden bg-[#080604]">
      {/* Background Image: Authentic Pakistani Seekh Kebab & BBQ display */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=85&w=2400&auto=format&fit=crop"
          alt="Ahmed Khan Pakistani BBQ, Sajji & Seekh Kebabs"
          className="w-full h-full object-cover object-[80%_center] lg:object-right transform scale-105 filter brightness-[0.70] contrast-[1.12]"
        />

        {/* Directional gradient: Darker on left & center for supreme typography readability, fading right to keep seekh kebabs prominent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(8,6,4,0.92) 0%, rgba(8,6,4,0.80) 40%, rgba(8,6,4,0.50) 70%, rgba(8,6,4,0.22) 100%)',
          }}
        />

        {/* Central radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 48% 50%, rgba(8,6,4,0.50) 0%, rgba(8,6,4,0.78) 55%, rgba(8,6,4,0.94) 100%)',
          }}
        />

        {/* Top and bottom subtle fade to blend with navbar and next section */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080604] via-transparent to-[#080604]/80 pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
        {/* 1. Top Decorative Chef Hat + Accent Lines */}
        <div className="flex items-center justify-center gap-3.5 sm:gap-6 mb-3 sm:mb-4 lg:mb-5">
          <div className="h-[1.5px] w-14 sm:w-24 md:w-32 lg:w-36 bg-[#E5A855] rounded-full" />
          <div className="text-[#E5A855] flex items-center justify-center">
            <ChefHat size={38} strokeWidth={1.75} className="text-[#E5A855] drop-shadow-md" />
          </div>
          <div className="h-[1.5px] w-14 sm:w-24 md:w-32 lg:w-36 bg-[#E5A855] rounded-full" />
        </div>

        {/* 2. Brand Heading: "AHMED KHAN" (Large, Elegant Serif, White / Warm Off-White) */}
        <h1 className="font-['Playfair_Display',Georgia,serif] text-4xl sm:text-6xl md:text-7xl lg:text-[5.4rem] xl:text-[6.2rem] font-bold tracking-[0.04em] sm:tracking-[0.05em] text-[#FFFDF9] uppercase leading-[0.98] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          AHMED KHAN
        </h1>

        {/* 3. Restaurant Heading: "RESTAURANT" (Noticeably Larger, Warm Gold / Orange-Gold, Bold Display Serif) */}
        <div className="font-['Playfair_Display',Georgia,serif] text-5xl sm:text-7xl md:text-8xl lg:text-[7.2rem] xl:text-[8.5rem] font-black tracking-[0.04em] sm:tracking-[0.06em] text-[#E5A855] uppercase leading-[0.88] mt-0.5 sm:mt-1 drop-shadow-[0_4px_22px_rgba(0,0,0,0.95)]">
          RESTAURANT
        </div>

        {/* 4. Tagline: "WHERE TASTE MEETS FLAME" (White, Bold Uppercase, Lines on both sides) */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 mt-4 sm:mt-5 lg:mt-6 w-full max-w-2xl px-2">
          <div className="h-[1.5px] flex-1 max-w-[50px] sm:max-w-[80px] md:max-w-[100px] bg-[#E5A855] rounded-full" />
          <span className="text-[#FFFDF9] font-bold text-xs sm:text-sm md:text-base lg:text-lg tracking-[0.22em] sm:tracking-[0.28em] uppercase whitespace-nowrap drop-shadow">
            WHERE TASTE MEETS FLAME
          </span>
          <div className="h-[1.5px] flex-1 max-w-[50px] sm:max-w-[80px] md:max-w-[100px] bg-[#E5A855] rounded-full" />
        </div>

        {/* 5. Short Description (Exact 2 lines on desktop) */}
        <p className="mt-3.5 sm:mt-4 lg:mt-5 max-w-[720px] text-stone-200/95 text-xs sm:text-sm md:text-[0.95rem] lg:text-[1.02rem] leading-relaxed text-center px-4 font-normal drop-shadow">
          Authentic Pakistani BBQ, slow-roasted Balochi &amp; Peshawari Sajji,
          <br className="hidden md:inline" />
          sizzling Desi Ghee Karahi, and traditional skewers cooked over live charcoal embers.
        </p>

        {/* 6. Rating + Location Information Capsule (Off-White, Pill Shape) */}
        <div className="mt-5 sm:mt-6 lg:mt-7 inline-flex items-center justify-center gap-2.5 sm:gap-3.5 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#FAF6EF] text-stone-900 shadow-xl shadow-black/35 border border-stone-200/70">
          <div className="flex items-center gap-1 text-[#E5A855]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={15} fill="#E5A855" strokeWidth={0} />
            ))}
          </div>
          <span className="font-bold text-stone-950 text-xs sm:text-sm md:text-[0.95rem]">4.9</span>
          <span className="text-stone-600 font-medium text-xs sm:text-sm md:text-[0.95rem]">(3,800+ Reviews)</span>
          <span className="text-stone-300 select-none mx-0.5 sm:mx-1">|</span>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm md:text-[0.95rem] text-stone-950 font-semibold">
            <MapPin size={16} className="text-[#E5A855] shrink-0" fill="#E5A855" fillOpacity={0.25} />
            <span>University Town, Peshawar</span>
          </div>
        </div>

        {/* 7. Main CTA Buttons (Side-by-side, Pill Shape, Same Visual Proportions) */}
        <div className="mt-6 sm:mt-7 lg:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full max-w-xl mx-auto">
          {/* LEFT BUTTON: Orange Gradient, White Text, Food Icon, ORDER ONLINE, Right Arrow */}
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="w-full sm:w-[245px] h-[52px] sm:h-[56px] px-8 rounded-full bg-gradient-to-r from-[#DF5419] via-[#E86D22] to-[#EE822A] hover:brightness-110 active:scale-[0.98] text-white font-bold text-xs sm:text-sm tracking-wider uppercase inline-flex items-center justify-center gap-3 shadow-xl shadow-orange-950/40 transition-all duration-300 cursor-pointer"
          >
            <Utensils size={18} className="text-white shrink-0" />
            <span>ORDER ONLINE</span>
            <ArrowRight size={18} className="text-white shrink-0" />
          </button>

          {/* RIGHT BUTTON: Off-White Background, Dark Text, List Icon, VIEW FULL MENU, Right Arrow */}
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="w-full sm:w-[245px] h-[52px] sm:h-[56px] px-8 rounded-full bg-[#FAF6EF] hover:bg-white active:scale-[0.98] text-stone-900 font-bold text-xs sm:text-sm tracking-wider uppercase inline-flex items-center justify-center gap-3 shadow-xl shadow-black/25 transition-all duration-300 cursor-pointer"
          >
            <List size={18} className="text-stone-900 shrink-0" />
            <span>VIEW FULL MENU</span>
            <ArrowRight size={18} className="text-stone-900 shrink-0" />
          </button>
        </div>

        {/* 8. Bottom Links: [Calendar Icon] Book A Table | [Location Icon] Get Directions */}
        <div className="mt-5 sm:mt-6 flex items-center justify-center gap-3.5 sm:gap-5 text-xs sm:text-sm font-medium">
          <button
            type="button"
            onClick={() => navigate('/reservation')}
            className="inline-flex items-center gap-1.5 text-white hover:text-[#E5A855] transition-colors cursor-pointer group"
          >
            <Calendar size={15} className="text-[#E5A855]" />
            <span className="underline underline-offset-4 decoration-[#FFFDF9]/60 group-hover:decoration-[#E5A855]">
              Book A Table
            </span>
          </button>

          <span className="text-stone-400 select-none">|</span>

          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="inline-flex items-center gap-1.5 text-white hover:text-[#E5A855] transition-colors cursor-pointer group"
          >
            <MapPin size={15} className="text-[#E5A855]" />
            <span className="underline underline-offset-4 decoration-[#FFFDF9]/60 group-hover:decoration-[#E5A855]">
              Get Directions
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
