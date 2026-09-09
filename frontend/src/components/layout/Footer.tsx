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
    <footer className="relative bg-[#181411] border-t border-[#51463D]/40 pt-16 pb-24 md:pb-16 text-[#AFA399] overflow-hidden">
      {/* Background subtle ambient warmth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-[#C97845]/8 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-[#51463D]/40">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#28221D] border border-[#51463D] flex items-center justify-center p-2">
                <FlameIcon size={24} />
              </div>
              <div>
                <span className="block text-xl font-black font-heading tracking-wider text-[#F3EDE5]">
                  AHMED KHAN
                </span>
                <span className="block text-[10px] tracking-[0.2em] text-[#D6A15D] font-semibold -mt-1 uppercase">
                  Restaurant • Peshawar
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-[#AFA399]">
              Peshawar’s premier culinary sanctuary for authentic charcoal-roasted Sajji, sizzling Desi Ghee Karahi, and traditional BBQ made with unmatched craftsmanship.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={restaurantInfo.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-[#28221D] border border-[#51463D] flex items-center justify-center text-[#AFA399] hover:text-[#D6A15D] hover:border-[#D6A15D]/60 transition-all"
              >
                <Facebook size={18} />
              </a>
              <a
                href={restaurantInfo.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-[#28221D] border border-[#51463D] flex items-center justify-center text-[#AFA399] hover:text-[#D6A15D] hover:border-[#D6A15D]/60 transition-all"
              >
                <Instagram size={18} />
              </a>
              <div className="px-3 py-1.5 rounded-lg bg-[#28221D] border border-[#51463D] text-xs font-semibold text-[#D6A15D] flex items-center gap-1.5">
                <Award size={14} className="text-[#C97845]" />
                <span>4.9★ Top Rated</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-bold font-heading uppercase tracking-wider text-[#F3EDE5] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C97845]" />
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Full Food Menu', path: '/menu' },
                { name: 'Track Your Order', path: '/track-order' },
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
                    className="flex items-center gap-2 text-[#AFA399] hover:text-[#D6A15D] transition-colors"
                  >
                    <ChevronRight size={14} className="text-[#D6A15D]" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-base font-bold font-heading uppercase tracking-wider text-[#F3EDE5] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C97845]" />
              Location & Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#D6A15D] shrink-0 mt-1" />
                <span className="leading-relaxed text-[#AFA399]">
                  {restaurantInfo.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <a
                  href={restaurantInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D6A15D] hover:scale-110 transition-transform shrink-0"
                  title="Chat on WhatsApp"
                  aria-label="Chat on WhatsApp"
                >
                  <Phone size={18} />
                </a>
                <a
                  href={restaurantInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#F3EDE5] hover:text-[#D6A15D] transition-colors"
                  title="Chat on WhatsApp"
                >
                  {restaurantInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#D6A15D] shrink-0" />
                <a
                  href={`mailto:${restaurantInfo.email}`}
                  className="text-xs text-[#AFA399] hover:text-[#D6A15D] transition-colors"
                >
                  {restaurantInfo.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div className="space-y-4">
            <h3 className="text-base font-bold font-heading uppercase tracking-wider text-[#F3EDE5] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C97845]" />
              Opening Hours
            </h3>
            <div className="p-4 rounded-xl bg-[#28221D] border border-[#51463D] space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-[#D6A15D] font-semibold mb-2">
                <Clock size={16} className="text-[#C97845]" />
                <span>Open 7 Days a Week</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-[#51463D]/50 text-[#AFA399]">
                <span>Mon - Thu</span>
                <span className="text-[#F3EDE5] font-medium">{restaurantInfo.openingHours.monday_thursday}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-[#51463D]/50 text-[#AFA399]">
                <span>Friday</span>
                <span className="text-[#F3EDE5] font-medium">{restaurantInfo.openingHours.friday}</span>
              </div>
              <div className="flex justify-between text-[#AFA399]">
                <span>Sat - Sun</span>
                <span className="text-[#F3EDE5] font-medium">{restaurantInfo.openingHours.saturday_sunday}</span>
              </div>
            </div>
            {user && (user.role === 'admin' || user.role === 'superadmin') && (
              <div className="pt-1">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-[#D6A15D] hover:underline transition-colors font-semibold"
                >
                  <ShieldCheck size={14} />
                  <span>Restaurant Management Portal</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#91857A]">
          <p>© 2026 Ahmed Khan Restaurant. All Rights Reserved. Peshawar, Pakistan.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-[#F3EDE5] transition-colors">Our Story</Link>
            <Link to="/menu" className="hover:text-[#F3EDE5] transition-colors">Order Online</Link>
            <Link to="/track-order" className="hover:text-[#D6A15D] transition-colors">Track Order</Link>
            <Link to="/contact" className="hover:text-[#F3EDE5] transition-colors">Get Directions</Link>
            <Link to="/login" className="hover:text-[#D6A15D] transition-colors text-[#91857A]">
              Staff / Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
