import React from 'react';
import { Link } from 'react-router-dom';
import { FlameIcon } from '../common/FlameIcon';
import { Button } from '../common/Button';
import { restaurantInfo } from '../../data/restaurantData';
import { ArrowRight, CheckCircle2, Award, Flame } from 'lucide-react';

export const RestaurantIntro: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#1C1815] border-y border-[#51463D]/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Story */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#332B25] border border-[#51463D] text-[#D6A15D] text-xs font-semibold uppercase tracking-widest">
              <FlameIcon size={14} glow={false} />
              <span>OUR HERITAGE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#F3EDE5] leading-tight">
              Where Tradition <span className="text-[#D6A15D]">Meets Fire</span>
            </h2>

            <p className="text-base sm:text-lg text-[#BDB1A5] leading-relaxed">
              Ahmed Khan Restaurant brings together authentic Pakistani flavors, heritage recipes, and the unforgettable aroma of open charcoal flames.
            </p>

            <div className="space-y-3 pt-2 text-sm text-[#F3EDE5]">
              {[
                'Handcrafted spice rubs aged in natural earthen jars',
                'Slow-turned whole chicken & mutton Sajji over red oak coals',
                'Desi Ghee Shinwari Karahi simmered in heavy cast-iron woks',
                'Spacious family halls, open rooftop braziers & traditional Dastarkhwan'
              ].map((point, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-[#7FA27A] shrink-0" />
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
              <div className="relative rounded-2xl overflow-hidden border border-[#51463D] shadow-2xl shadow-black/60">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop"
                  alt="Ahmed Khan Slow-Roasted Sajji & BBQ Feast"
                  className="w-full h-96 sm:h-[450px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1815] via-transparent to-transparent opacity-75" />
              </div>

              {/* Floating Badge Card */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 p-5 rounded-2xl bg-[#28221D]/95 border border-[#51463D] backdrop-blur-md shadow-2xl shadow-black/80 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C97845] to-[#D6A15D] flex items-center justify-center text-[#1C1815] font-extrabold text-xl shadow-lg">
                    <Flame size={26} />
                  </div>
                  <div>
                    <span className="block text-xl font-bold font-heading text-[#F3EDE5]">100% Halal</span>
                    <span className="block text-xs text-[#D6A15D] uppercase tracking-wider font-semibold">Fresh Meat Daily</span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-[#BDB1A5]">
                  Prepared fresh to order on live charcoal embers in University Town, Peshawar.
                </p>
              </div>

              {/* Floating Rating Badge */}
              <div className="absolute -top-4 -right-4 p-3.5 rounded-xl bg-[#332B25]/95 border border-[#51463D] backdrop-blur-md shadow-xl flex items-center gap-2.5">
                <Award className="text-[#D6A15D]" size={20} />
                <div>
                  <div className="text-sm font-bold text-[#F3EDE5]">4.9 / 5.0</div>
                  <div className="text-[10px] text-[#BDB1A5]">Customer Choice</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
