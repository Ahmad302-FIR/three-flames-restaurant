import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { Flame, ShieldCheck, UtensilsCrossed, Bike } from 'lucide-react';

export const WhyThreeFlames: React.FC = () => {
  const features = [
    {
      icon: <Flame className="w-8 h-8 text-[#FF8A1F]" />,
      title: 'Authentic Flavors',
      description: 'Traditional secret spices and wood-fired marinades inspired by the heritage of Peshawar, Namak Mandi, and Balochi Sajji roasting.',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#D99A32]" />,
      title: 'Quality Ingredients',
      description: '100% fresh Halal mutton, chicken, and beef hand-selected daily, seasoned with pure rock salt and desi ghee.',
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8 text-[#FF8A1F]" />,
      title: 'Memorable Dining',
      description: 'Warm ambiance with live charcoal grill pits, rooftop flame heaters, and private traditional Dastarkhwan family spaces.',
    },
    {
      icon: <Bike className="w-8 h-8 text-[#D99A32]" />,
      title: 'Convenient Ordering',
      description: 'Super-fast thermal delivery across Peshawar, hassle-free takeaway pickup, and instant online table reservations.',
    },
  ];

  return (
    <section className="py-20 bg-[#080604] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="THE AHMED KHAN PROMISE"
          title="WHY CHOOSE US"
          subtitle="We craft each dish with uncompromising dedication to quality, flavor, and authentic Pakistani hospitality."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feat, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-[#1A100C] border border-[#FF8A1F]/15 hover:border-[#FF8A1F]/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-[#F97316]/10 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#120B08] border border-[#FF8A1F]/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#FF8A1F] transition-all duration-300 shadow-inner">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold font-heading text-[#FFF7ED] mb-3">
                  {feat.title}
                </h3>
                <p className="text-sm text-[#B8AAA0] leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-semibold text-[#D99A32]">
                <span>Peshawar Heritage</span>
                <span>•</span>
                <span>Ahmed Khan</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
