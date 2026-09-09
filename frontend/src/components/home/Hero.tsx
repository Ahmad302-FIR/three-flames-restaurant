import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FlameIcon } from '../common/FlameIcon';
import { Button } from '../common/Button';
import { StarRating } from '../common/StarRating';
import { restaurantInfo } from '../../data/restaurantData';
import { ArrowRight, Calendar, MapPin, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#080604]">
      {/* Background Image with Dark Flame Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format&fit=crop"
          alt="Ahmed Khan Pakistani BBQ & Sajji"
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.45] contrast-[1.15]"
        />
        {/* Deep coal vignette layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080604] via-[#080604]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080604]/80 via-transparent to-[#080604]/80" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-20">
        {/* Top Trust & Heritage Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A100C]/90 border border-[#FF8A1F]/30 backdrop-blur-md mb-6 shadow-xl shadow-black/40">
          <FlameIcon size={16} />
          <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#FF8A1F]">
            Peshawar's Premier Flame BBQ & Sajji
          </span>
          <span className="hidden sm:inline-block text-[#B8AAA0]">•</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[#F2B84B]">
            <Sparkles size={12} /> 100% Halal Fresh Charcoal
          </span>
        </div>

        {/* Main Grand Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-heading tracking-wider text-[#FFF7ED] uppercase leading-[1.05] drop-shadow-2xl">
          AHMED KHAN RESTAURANT
        </h1>

        {/* Tagline */}
        <div className="mt-3 sm:mt-4 text-lg sm:text-2xl md:text-3xl font-extrabold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A1F] via-[#F97316] to-[#D99A32]">
          WHERE TASTE MEETS FLAME
        </div>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg text-[#B8AAA0] leading-relaxed">
          Authentic Pakistani BBQ, slow-roasted Balochi & Peshawari Sajji, sizzling Desi Ghee Karahi, and traditional skewers cooked over live charcoal embers.
        </p>

        {/* Trust Indicators */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-2 px-4 rounded-xl bg-[#120B08]/80 border border-[#FF8A1F]/15">
          <div className="flex items-center gap-2">
            <StarRating rating={4.9} showValue />
            <span className="text-xs text-[#B8AAA0]">({restaurantInfo.stats.totalReviews} Reviews)</span>
          </div>
          <span className="text-white/20 hidden sm:inline">|</span>
          <div className="text-xs text-[#FFF7ED] font-medium flex items-center gap-1.5">
            <MapPin size={13} className="text-[#FF8A1F]" />
            <span>University Town, Peshawar</span>
          </div>
        </div>

        {/* CTA Button Group */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/menu')}
            leftIcon={<FlameIcon size={18} glow={false} />}
          >
            ORDER ONLINE NOW
          </Button>

          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => navigate('/menu')}
            rightIcon={<ArrowRight size={18} className="text-[#FF8A1F]" />}
          >
            VIEW FULL MENU
          </Button>
        </div>

        {/* Quick reservation & location links */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-[#B8AAA0]">
          <button
            onClick={() => navigate('/reservation')}
            className="flex items-center gap-1.5 hover:text-[#FF8A1F] transition-colors"
          >
            <Calendar size={14} className="text-[#D99A32]" />
            <span className="underline underline-offset-4">Book A Table</span>
          </button>
          <span>•</span>
          <button
            onClick={() => navigate('/contact')}
            className="flex items-center gap-1.5 hover:text-[#FF8A1F] transition-colors"
          >
            <MapPin size={14} className="text-[#D99A32]" />
            <span className="underline underline-offset-4">Get Directions</span>
          </button>
        </div>
      </div>
    </section>
  );
};
