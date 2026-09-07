import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import { FlameIcon } from '../common/FlameIcon';
import { restaurantInfo } from '../../data/restaurantData';
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  Instagram,
  Facebook,
  ChevronRight,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <footer className="relative bg-[#050302] border-t border-[#FF8A1F]/20 pt-16 pb-24 md:pb-16 text-[#B8AAA0] overflow-hidden">
      {/* Background ambient flame glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-[#F97316]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-[#FF8A1F]/15">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/40 flex items-center justify-center p-2">
                <FlameIcon size={24} />
              </div>
              <div>
                <span className="block text-xl font-black font-heading tracking-widest text-[#FFF7ED]">
                  THREE FLAMES
                </span>
                <span className="block text-[10px] tracking-[0.25em] text-[#D99A32] font-semibold -mt-1 uppercase">
                  Where Taste Meets Flame
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-[#B8AAA0]">
              Peshawar’s premier culinary sanctuary for authentic charcoal-roasted Sajji, sizzling Desi Ghee Karahi, and traditional BBQ made with unmatched craftsmanship.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={restaurantInfo.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-[#1A100C] border border-[#FF8A1F]/20 flex items-center justify-center text-[#B8AAA0] hover:text-[#FF8A1F] hover:border-[#FF8A1F] transition-all"
              >
                <Facebook size={18} />
              </a>
              <a
                href={restaurantInfo.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-[#1A100C] border border-[#FF8A1F]/20 flex items-center justify-center text-[#B8AAA0] hover:text-[#FF8A1F] hover:border-[#FF8A1F] transition-all"
              >
                <Instagram size={18} />
              </a>
              <div className="px-3 py-1.5 rounded-lg bg-[#1A100C] border border-[#D99A32]/30 text-xs font-semibold text-[#D99A32] flex items-center gap-1.5">
                <Award size={14} className="text-[#FF8A1F]" />
                <span>4.9★ Top Rated</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-bold font-heading uppercase tracking-wider text-[#FFF7ED] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF8A1F]" />
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Full Food Menu', path: '/menu' },
                { name: 'Our Signature Sajji', path: '/menu?cat=sajji' },
                { name: 'Desi Wok Karahi', path: '/menu?cat=karahi' },
                { name: 'Book A Table', path: '/reservation' },
                { name: 'About Our Heritage', path: '/about' },
                { name: 'Photo Gallery', path: '/gallery' },
                { name: 'Customer Reviews', path: '/#reviews' },
                { name: 'Contact & Location', path: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-2 hover:text-[#FF8A1F] transition-colors"
                  >
                    <ChevronRight size={14} className="text-[#D99A32]" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-base font-bold font-heading uppercase tracking-wider text-[#FFF7ED] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF8A1F]" />
              Location & Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#FF8A1F] shrink-0 mt-1" />
                <span className="leading-relaxed">
                  {restaurantInfo.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <a
                  href={restaurantInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF8A1F] hover:scale-110 transition-transform shrink-0"
                  title="Chat on WhatsApp"
                  aria-label="Chat on WhatsApp"
                >
                  <Phone size={18} />
                </a>
                <a
                  href={restaurantInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#FFF7ED] hover:text-[#FF8A1F] transition-colors"
                  title="Chat on WhatsApp"
                >
                  {restaurantInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#FF8A1F] shrink-0" />
                <a
                  href={`mailto:${restaurantInfo.email}`}
                  className="text-xs hover:text-[#FF8A1F] transition-colors"
                >
                  {restaurantInfo.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div className="space-y-4">
            <h3 className="text-base font-bold font-heading uppercase tracking-wider text-[#FFF7ED] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF8A1F]" />
              Opening Hours
            </h3>
            <div className="p-4 rounded-xl bg-[#120B08] border border-[#FF8A1F]/20 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-[#D99A32] font-semibold mb-2">
                <Clock size={16} className="text-[#FF8A1F]" />
                <span>Open 7 Days a Week</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-white/5">
                <span>Mon - Thu</span>
                <span className="text-[#FFF7ED] font-medium">{restaurantInfo.openingHours.monday_thursday}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-white/5">
                <span>Friday</span>
                <span className="text-[#FFF7ED] font-medium">{restaurantInfo.openingHours.friday}</span>
              </div>
              <div className="flex justify-between">
                <span>Sat - Sun</span>
                <span className="text-[#FFF7ED] font-medium">{restaurantInfo.openingHours.saturday_sunday}</span>
              </div>
            </div>
            {user && (user.role === 'admin' || user.role === 'superadmin') && (
              <div className="pt-1">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-[#FF8A1F] hover:underline transition-colors font-semibold"
                >
                  <ShieldCheck size={14} />
                  <span>Restaurant Management Portal</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B8AAA0]">
          <p>© 2026 Three Flames Restaurant. All Rights Reserved. Peshawar, Pakistan.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-white transition-colors">Our Story</Link>
            <Link to="/menu" className="hover:text-white transition-colors">Order Online</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Get Directions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
