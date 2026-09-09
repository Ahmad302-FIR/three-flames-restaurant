import React from 'react';
import { Link } from 'react-router-dom';
import { FlameIcon } from '../common/FlameIcon';
import { Button } from '../common/Button';
import { restaurantInfo } from '../../data/restaurantData';
import { ArrowRight, CheckCircle2, Award, Flame } from 'lucide-react';

export const RestaurantIntro: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#FFFDFC] border-y border-[#E8DED6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Story */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F3E4DC] border border-[#E8DED6] text-[#B85C38] text-xs font-semibold uppercase tracking-widest">
              <FlameIcon size={14} glow={false} />
              <span>OUR HERITAGE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#25201D] leading-tight">
              Where Tradition <span className="text-[#B85C38]">Meets Fire</span>
            </h2>

            <p className="text-base sm:text-lg text-[#6F6761] leading-relaxed">
              Ahmed Khan Restaurant brings together authentic Pakistani flavors, heritage recipes, and the unforgettable aroma of open charcoal flames.
            </p>

            <div className="space-y-3 pt-2 text-sm text-[#25201D]">
              {[
                'Handcrafted spice rubs aged in natural earthen jars',
                'Slow-turned whole chicken & mutton Sajji over red oak coals',
                'Desi Ghee Shinwari Karahi simmered in heavy cast-iron woks',
                'Spacious family halls, open rooftop braziers & traditional Dastarkhwan'
              ].map((point, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-[#4E8A57] shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link to="/about">
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight size={16} />}
                >
                  DISCOVER OUR STORY
                </Button>
              </Link>
              <Link to="/reservation">
                <Button variant="secondary" size="md">
                  RESERVE A TABLE
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden border border-[#E8DED6] shadow-xl shadow-stone-900/10">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop"
                  alt="Ahmed Khan Slow-Roasted Sajji & BBQ Feast"
                  className="w-full h-96 sm:h-[450px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#25201D]/60 via-transparent to-transparent opacity-75" />
              </div>

              {/* Floating Badge Card */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 p-5 rounded-2xl bg-[#FFFFFF]/95 border border-[#E8DED6] backdrop-blur-md shadow-xl shadow-stone-900/10 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#B85C38] flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
                    <Flame size={26} />
                  </div>
                  <div>
                    <span className="block text-xl font-bold font-heading text-[#25201D]">100% Halal</span>
                    <span className="block text-xs text-[#B85C38] uppercase tracking-wider font-semibold">Fresh Meat Daily</span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-[#6F6761]">
                  Prepared fresh to order on live charcoal embers in University Town, Peshawar.
                </p>
              </div>

              {/* Floating Rating Badge */}
              <div className="absolute -top-4 -right-4 p-3.5 rounded-xl bg-[#FFFFFF]/95 border border-[#E8DED6] backdrop-blur-md shadow-lg flex items-center gap-2.5">
                <Award className="text-[#B85C38]" size={20} />
                <div>
                  <div className="text-sm font-bold text-[#25201D]">4.9 / 5.0</div>
                  <div className="text-[10px] text-[#6F6761]">Customer Choice</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
