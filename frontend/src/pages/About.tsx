import React from 'react';
import { SectionHeading } from '../components/common/SectionHeading';
import { FlameIcon } from '../components/common/FlameIcon';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { restaurantInfo } from '../../src/data/restaurantData';
import {
  Flame,
  Award,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080604] pt-28 pb-20 text-[#FFF7ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Story Heading */}
        <SectionHeading
          badgeText="OUR ROOTS & PASSION"
          title="THE THREE FLAMES STORY"
          subtitle="How a dedication to live wood-fire cooking transformed into Peshawar’s premier culinary destination."
        />

        {/* Narrative Section 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-16">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
              The Art of <span className="text-[#FF8A1F]">The Charcoal Embers</span>
            </h2>
            <p className="text-sm sm:text-base text-[#B8AAA0] leading-relaxed">
              At Three Flames Restaurant, cooking is not merely preparation—it is a sacred performance of patience, timber, and high-heat alchemy. Born in the heart of Peshawar's historic gastronomy corridor, we set out to preserve centuries of Pashtun and Balochi barbecue mastery.
            </p>
            <p className="text-sm sm:text-base text-[#B8AAA0] leading-relaxed">
              Our signature Sajji skewers are suspended perpendicular to red oak embers for up to three hours. Fat renders naturally, the rock salt marinade crystallizes, and the skin acquires an unmistakable golden crunch while locking in pure succulence.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#120B08] border border-[#FF8A1F]/20">
                <span className="text-2xl font-black font-heading text-[#FF8A1F] block">100%</span>
                <span className="text-xs text-[#B8AAA0]">Fresh Halal Meat Daily</span>
              </div>
              <div className="p-4 rounded-xl bg-[#120B08] border border-[#FF8A1F]/20">
                <span className="text-2xl font-black font-heading text-[#D99A32] block">3 Hours</span>
                <span className="text-xs text-[#B8AAA0]">Slow Flame Roasting</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-[#FF8A1F]/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop"
                alt="Peshawari Sajji and BBQ skewers"
                className="w-full h-96 sm:h-[420px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080604] via-transparent to-transparent opacity-70" />
            </div>
          </div>
        </div>

        {/* The Three Flames Philosophy: 3 Pillars */}
        <div className="my-20 p-8 sm:p-14 rounded-3xl bg-[#120B08] border border-[#FF8A1F]/25 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF8A1F]">
              OUR THREE PILLARS
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Why We Are Named "Three Flames"
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#1A100C] border border-[#FF8A1F]/20 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#080604] border border-[#FF8A1F]/40 flex items-center justify-center text-[#FF8A1F]">
                <Flame size={24} />
              </div>
              <h4 className="text-lg font-bold font-heading text-white">1. The Flame of Heritage</h4>
              <p className="text-xs text-[#B8AAA0] leading-relaxed">
                Authentic Namak Mandi lamb cuts, whole Balochi chicken sajji, and heritage cast-iron Shinwari Karahi cooked only with salt, tomatoes, and desi ghee.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1A100C] border border-[#FF8A1F]/20 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#080604] border border-[#D99A32]/40 flex items-center justify-center text-[#D99A32]">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-lg font-bold font-heading text-white">2. The Flame of Purity</h4>
              <p className="text-xs text-[#B8AAA0] leading-relaxed">
                Uncompromising hygiene standards, premium organic cooking fat, and meat inspected each dawn by our head culinary butcher.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1A100C] border border-[#FF8A1F]/20 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#080604] border border-[#FF8A1F]/40 flex items-center justify-center text-[#FF8A1F]">
                <Users size={24} />
              </div>
              <h4 className="text-lg font-bold font-heading text-white">3. The Flame of Hospitality</h4>
              <p className="text-xs text-[#B8AAA0] leading-relaxed">
                Pashtun 'Melmastia' (gracious hospitality) where every diner is treated like an honored dignitary sharing our family table.
              </p>
            </div>
          </div>
        </div>

        {/* Master Chefs Section */}
        <div className="my-20 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D99A32]">
              BEHIND THE BRAZIERS
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Meet Our Flame Masters
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Ustad Gulzar Khan',
                role: 'Master of Balochi Sajji',
                exp: '24 Years Experience',
                image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=600&auto=format&fit=crop',
                bio: 'Specialist in slow-turned charcoal Sajji and secret mountain spice blends.',
              },
              {
                name: 'Chef Dawood Shinwari',
                role: 'Head of Shinwari & Wok Karahi',
                exp: '19 Years Experience',
                image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop',
                bio: 'Master of cast-iron high heat reduction, using only pure green chillies, ginger, and desi ghee.',
              },
              {
                name: 'Ustad Tariq Afridi',
                role: 'Master Kebab Skewer Craftsman',
                exp: '16 Years Experience',
                image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?q=80&w=600&auto=format&fit=crop',
                bio: 'Hand-minces beef and mutton with fresh coriander, smoked marrow, and secret aromatics.',
              },
            ].map((chef, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#120B08] border border-[#FF8A1F]/20 overflow-hidden group hover:border-[#FF8A1F]/50 transition-colors"
              >
                <div className="h-72 overflow-hidden bg-[#1A100C]">
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-lg font-bold font-heading text-white">{chef.name}</h4>
                    <span className="text-[10px] text-[#D99A32] font-semibold">{chef.exp}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#FF8A1F]">{chef.role}</p>
                  <p className="text-xs text-[#B8AAA0] leading-relaxed pt-1">{chef.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-8">
          <Link to="/reservation">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />}>
              EXPERIENCE OUR DINING IN PERSON
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
