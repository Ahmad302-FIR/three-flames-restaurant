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
    <div className="min-h-screen bg-[#FFFDFC] pt-28 pb-20 text-[#25201D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Story Heading */}
        <SectionHeading
          badgeText="OUR ROOTS & PASSION"
          title="THE AHMED KHAN STORY"
          subtitle="How a dedication to live wood-fire cooking transformed into Peshawar’s premier culinary destination."
        />

        {/* Narrative Section 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-16">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#25201D]">
              The Art of <span className="text-[#B85C38]">The Charcoal Embers</span>
            </h2>
            <p className="text-sm sm:text-base text-[#6F6761] leading-relaxed">
              At Ahmed Khan Restaurant, cooking is not merely preparation—it is a sacred performance of patience, timber, and high-heat alchemy. Born in the heart of Peshawar's historic gastronomy corridor, we set out to preserve centuries of Pashtun and Balochi barbecue mastery.
            </p>
            <p className="text-sm sm:text-base text-[#6F6761] leading-relaxed">
              Our signature Sajji skewers are suspended perpendicular to red oak embers for up to three hours. Fat renders naturally, the rock salt marinade crystallizes, and the skin acquires an unmistakable golden crunch while locking in pure succulence.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8DED6]">
                <span className="text-2xl font-black font-heading text-[#B85C38] block">100%</span>
                <span className="text-xs text-[#6F6761]">Fresh Halal Meat Daily</span>
              </div>
              <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8DED6]">
                <span className="text-2xl font-black font-heading text-[#B85C38] block">3 Hours</span>
                <span className="text-xs text-[#6F6761]">Slow Flame Roasting</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-[#E8DED6] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop"
                alt="Peshawari Sajji and BBQ skewers"
                className="w-full h-96 sm:h-[420px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDFC] via-transparent to-transparent opacity-70" />
            </div>
          </div>
        </div>

        {/* The Ahmed Khan Philosophy: 3 Pillars */}
        <div className="my-20 p-8 sm:p-14 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B85C38]">
              OUR THREE PILLARS
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#25201D]">
              The Ahmed Khan Culinary Pillars
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#F7F3EE] border border-[#E8DED6] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFFDFC] border border-[#E8DED6] flex items-center justify-center text-[#B85C38]">
                <Flame size={24} />
              </div>
              <h4 className="text-lg font-bold font-heading text-[#25201D]">1. The Flame of Heritage</h4>
              <p className="text-xs text-[#6F6761] leading-relaxed">
                Authentic Namak Mandi lamb cuts, whole Balochi chicken sajji, and heritage cast-iron Shinwari Karahi cooked only with salt, tomatoes, and desi ghee.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F3EE] border border-[#E8DED6] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFFDFC] border border-[#E8DED6] flex items-center justify-center text-[#B85C38]">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-lg font-bold font-heading text-[#25201D]">2. The Flame of Purity</h4>
              <p className="text-xs text-[#6F6761] leading-relaxed">
                Uncompromising hygiene standards, premium organic cooking fat, and meat inspected each dawn by our head culinary butcher.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F3EE] border border-[#E8DED6] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFFDFC] border border-[#E8DED6] flex items-center justify-center text-[#B85C38]">
                <Users size={24} />
              </div>
              <h4 className="text-lg font-bold font-heading text-[#25201D]">3. The Flame of Hospitality</h4>
              <p className="text-xs text-[#6F6761] leading-relaxed">
                Pashtun 'Melmastia' (gracious hospitality) where every diner is treated like an honored dignitary sharing our family table.
              </p>
            </div>
          </div>
        </div>

        {/* Master Chefs Section */}
        <div className="my-20 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B85C38]">
              BEHIND THE BRAZIERS
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#25201D]">
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
                className="rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] overflow-hidden group hover:border-[#E8DED6] transition-colors"
              >
                <div className="h-72 overflow-hidden bg-[#F7F3EE]">
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-lg font-bold font-heading text-[#25201D]">{chef.name}</h4>
                    <span className="text-[10px] text-[#B85C38] font-semibold">{chef.exp}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#B85C38]">{chef.role}</p>
                  <p className="text-xs text-[#6F6761] leading-relaxed pt-1">{chef.bio}</p>
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
