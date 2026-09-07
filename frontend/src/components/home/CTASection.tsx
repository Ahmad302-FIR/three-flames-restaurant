import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FlameIcon } from '../common/FlameIcon';
import { Button } from '../common/Button';
import { restaurantInfo } from '../../data/restaurantData';
import { Phone, CalendarCheck, ArrowRight } from 'lucide-react';

export const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-[#080604] relative overflow-hidden">
      {/* Visual background with flame flare */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-[#FF8A1F]/40 bg-gradient-to-r from-[#1A100C] via-[#120B08] to-[#1A100C] p-8 sm:p-14 lg:p-20 shadow-2xl shadow-black/80">
          <div className="absolute inset-0 bg-[radial-gradient(#F97316_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#F97316]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#D99A32]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#080604] border border-[#FF8A1F]/40 shadow-inner mb-2">
              <FlameIcon size={36} />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-[#FFF7ED] uppercase tracking-wide leading-tight">
              Ready to Experience the Flame?
            </h2>

            <p className="text-base sm:text-lg text-[#B8AAA0] max-w-xl mx-auto leading-relaxed">
              Order online for fast hot delivery straight to your doorstep, or reserve an authentic family Dastarkhwan or rooftop flame table today.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/menu')}
                leftIcon={<FlameIcon size={18} glow={false} />}
              >
                ORDER FOOD ONLINE
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/reservation')}
                leftIcon={<CalendarCheck size={18} className="text-[#FF8A1F]" />}
              >
                BOOK A TABLE
              </Button>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-sm text-[#B8AAA0]">
              <span className="flex items-center gap-2">
                <a
                  href={restaurantInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF8A1F] hover:scale-110 transition-transform"
                  title="Chat on WhatsApp"
                  aria-label="Chat on WhatsApp"
                >
                  <Phone size={16} />
                </a>
                <a
                  href={restaurantInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white font-semibold"
                  title="Chat on WhatsApp"
                >
                  Call: {restaurantInfo.phone}
                </a>
              </span>
              <span>•</span>
              <span className="text-xs">{restaurantInfo.address}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
