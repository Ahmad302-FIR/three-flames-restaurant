import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { Flame, ShieldCheck, UtensilsCrossed, Bike } from 'lucide-react';

export const WhyThreeFlames: React.FC = () => {
  const features = [
    {
      icon: <Flame className="w-8 h-8 text-[#B85C38]" />,
      title: 'Authentic Flavors',
      description: 'Traditional secret spices and wood-fired marinades inspired by the heritage of Peshawar, Namak Mandi, and Balochi Sajji roasting.',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#B85C38]" />,
      title: 'Quality Ingredients',
      description: '100% fresh Halal mutton, chicken, and beef hand-selected daily, seasoned with pure rock salt and desi ghee.',
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8 text-[#B85C38]" />,
      title: 'Memorable Dining',
      description: 'Warm ambiance with live charcoal grill pits, rooftop flame heaters, and private traditional Dastarkhwan family spaces.',
    },
    {
      icon: <Bike className="w-8 h-8 text-[#B85C38]" />,
      title: 'Convenient Ordering',
      description: 'Super-fast thermal delivery across Peshawar, hassle-free takeaway pickup, and instant online table reservations.',
    },
  ];

  return (
    <section className="py-20 bg-[#F7F3EE] relative">
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
              className="p-8 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] hover:border-[#B85C38]/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#F7F3EE] border border-[#E8DED6] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#B85C38]/60 transition-all duration-300 shadow-inner">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold font-heading text-[#25201D] mb-3">
                  {feat.title}
                </h3>
                <p className="text-sm text-[#6F6761] leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8DED6] flex items-center gap-2 text-xs font-semibold text-[#B85C38]">
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
