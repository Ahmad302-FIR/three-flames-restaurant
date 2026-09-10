import React from 'react';
import { Link } from 'react-router-dom';
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
  Award,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#25201D] border-t border-[#E8DED6] pt-16 pb-24 md:pb-16 text-[#B8ADA4] overflow-hidden">
      {/* Background subtle ambient warmth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-[#B85C38]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="inline-block mb-1" aria-label="AKR Home">
              <img
                src="/akr-logo-light.png"
                alt="AKR Pakistani BBQ & Sajji"
                className="h-16 w-auto object-contain hover:opacity-95 transition-opacity"
              />
            </Link>
            <p className="text-sm leading-relaxed text-[#B8ADA4]">
              Peshawar’s premier culinary sanctuary for authentic charcoal-roasted Sajji, sizzling Desi Ghee Karahi, and traditional BBQ made with unmatched craftsmanship.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={restaurantInfo.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#B8ADA4] hover:text-[#B85C38] hover:border-[#B85C38]/60 transition-all"
              >
                <Facebook size={18} />
              </a>
              <a
                href={restaurantInfo.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#B8ADA4] hover:text-[#B85C38] hover:border-[#B85C38]/60 transition-all"
              >
                <Instagram size={18} />
              </a>
              <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-[#F7F3EE] flex items-center gap-1.5">
                <Award size={14} className="text-[#B85C38]" />
                <span>4.9★ Top Rated</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-bold font-heading uppercase tracking-wider text-[#FFFDFC] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B85C38]" />
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
                    className="flex items-center gap-2 text-[#F7F3EE]/80 hover:text-[#B85C38] transition-colors"
                  >
                    <ChevronRight size={14} className="text-[#B85C38]" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-base font-bold font-heading uppercase tracking-wider text-[#FFFDFC] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B85C38]" />
              Location & Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#B85C38] shrink-0 mt-1" />
                <span className="leading-relaxed text-[#B8ADA4]">
                  {restaurantInfo.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <a
                  href={restaurantInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B85C38] hover:scale-110 transition-transform shrink-0"
                  title="Chat on WhatsApp"
                  aria-label="Chat on WhatsApp"
                >
                  <Phone size={18} />
                </a>
                <a
                  href={restaurantInfo.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#FFFDFC] hover:text-[#B85C38] transition-colors"
                  title="Chat on WhatsApp"
                >
                  {restaurantInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#B85C38] shrink-0" />
                <a
                  href={`mailto:${restaurantInfo.email}`}
                  className="text-xs text-[#B8ADA4] hover:text-[#B85C38] transition-colors"
                >
                  {restaurantInfo.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div className="space-y-4">
            <h3 className="text-base font-bold font-heading uppercase tracking-wider text-[#FFFDFC] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B85C38]" />
              Opening Hours
            </h3>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-[#FFFDFC] font-semibold mb-2">
                <Clock size={16} className="text-[#B85C38]" />
                <span>Open 7 Days a Week</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-white/10 text-[#B8ADA4]">
                <span>Mon - Thu</span>
                <span className="text-[#FFFDFC] font-medium">{restaurantInfo.openingHours.monday_thursday}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-white/10 text-[#B8ADA4]">
                <span>Friday</span>
                <span className="text-[#FFFDFC] font-medium">{restaurantInfo.openingHours.friday}</span>
              </div>
              <div className="flex justify-between text-[#B8ADA4]">
                <span>Sat - Sun</span>
                <span className="text-[#FFFDFC] font-medium">{restaurantInfo.openingHours.saturday_sunday}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B8ADA4]">
          <p>© 2026 Ahmed Khan Restaurant. All Rights Reserved. Peshawar, Pakistan.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-[#FFFDFC] transition-colors">Our Story</Link>
            <Link to="/menu" className="hover:text-[#FFFDFC] transition-colors">Order Online</Link>
            <Link to="/track-order" className="hover:text-[#B85C38] transition-colors">Track Order</Link>
            <Link to="/contact" className="hover:text-[#FFFDFC] transition-colors">Get Directions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
