import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FlameIcon } from '../common/FlameIcon';
import { Button } from '../common/Button';
import { restaurantInfo } from '../../data/restaurantData';
import { Phone, CalendarCheck, ArrowRight } from 'lucide-react';

export const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-[#F7F3EE] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-[#3A322D] bg-gradient-to-r from-[#25201D] via-[#2E2723] to-[#25201D] p-8 sm:p-14 lg:p-20 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(#B85C38_1px,transparent_1px)] [background-size:24px_24px] opacity-5" />

          {/* Ambient Warm Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#B85C38]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#B85C38]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#25201D] border border-[#3A322D] shadow-inner mb-2">
              <FlameIcon size={36} />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-[#F3EDE5] uppercase tracking-wide leading-tight">
              Ready to Experience the Flame?
            </h2>

            <p className="text-base sm:text-lg text-[#D4C8BC] max-w-xl mx-auto leading-relaxed">
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
                leftIcon={<CalendarCheck size={18} className="text-[#B85C38]" />}
              >
                BOOK A TABLE
              </Button>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-sm text-[#D4C8BC]">
              <span className="flex items-center gap-2">
                <a
                  href={restaurantInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B85C38] hover:scale-110 transition-transform"
                  title="Chat on WhatsApp"
                  aria-label="Chat on WhatsApp"
                >
                  <Phone size={16} />
                </a>
                <a
                  href={restaurantInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white font-semibold transition-colors"
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
