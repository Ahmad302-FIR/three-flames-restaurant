import React, { useState } from 'react';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { FlameIcon } from '../components/common/FlameIcon';
import { restaurantInfo } from '../data/restaurantData';
import api from '../services/api';
import { useAppDispatch } from '../store/store';
import { addToast } from '../store/slices/uiSlice';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanEmail || !cleanMessage) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Required Fields Missing',
          message: 'Please provide your name, email, and message.',
        })
      );
      return;
    }

    setIsSending(true);
    try {
      await api.post('/contact', {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        subject: cleanSubject || 'Customer Inquiry',
        message: cleanMessage
      });
      dispatch(addToast({ type: 'success', title: 'Message Sent! 🔥', message: 'We\'ll get back to you soon.' }));
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      dispatch(addToast({ type: 'error', title: 'Send Failed', message: err.message || 'Could not send message. Please try again.' }));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080604] pt-28 pb-20 text-[#FFF7ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="GET IN TOUCH"
          title="VISIT OR CONTACT US"
          subtitle="Located in University Town, Peshawar. Reach out for event inquiries, feedback, or table inquiries."
          className="mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[#120B08] border border-[#FF8A1F]/25 space-y-6 shadow-2xl">
              <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2 pb-4 border-b border-[#FF8A1F]/15">
                <FlameIcon size={20} />
                Restaurant Headquarters
              </h3>

              <div className="space-y-5 text-xs sm:text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 flex items-center justify-center text-[#FF8A1F] shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Physical Address</span>
                    <span className="text-[#B8AAA0] leading-relaxed block mt-0.5">
                      {restaurantInfo.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 flex items-center justify-center text-[#FF8A1F] shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Helpline & Hotline</span>
                    <a
                      href={`tel:${restaurantInfo.phone}`}
                      className="text-[#FF8A1F] font-bold hover:underline block mt-0.5"
                    >
                      {restaurantInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 flex items-center justify-center text-[#FF8A1F] shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Email Support</span>
                    <a
                      href={`mailto:${restaurantInfo.email}`}
                      className="text-[#B8AAA0] hover:text-white block mt-0.5"
                    >
                      {restaurantInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 flex items-center justify-center text-[#D99A32] shrink-0 mt-0.5">
                    <Clock size={20} />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <span className="font-bold text-white block">Service Hours</span>
                    <div className="text-xs text-[#B8AAA0] space-y-1">
                      <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-1">
                        <span>Monday – Thursday:</span>
                        <span className="text-white font-medium">{restaurantInfo.openingHours.monday_thursday}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-1">
                        <span>Friday:</span>
                        <span className="text-white font-medium">{restaurantInfo.openingHours.friday}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span>Saturday – Sunday:</span>
                        <span className="text-white font-medium">{restaurantInfo.openingHours.saturday_sunday}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Preview Frame */}
            <div className="rounded-3xl overflow-hidden border border-[#FF8A1F]/20 bg-[#120B08] p-4 text-center space-y-3">
              <div className="h-48 rounded-2xl bg-[#1A100C] relative flex items-center justify-center overflow-hidden border border-white/5">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop"
                  alt="Peshawar Map Location"
                  className="w-full h-full object-cover opacity-40"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#080604]/60 flex flex-col items-center justify-center p-4">
                  <MapPin size={32} className="text-[#FF8A1F] animate-bounce" />
                  <span className="text-xs font-bold text-white mt-1">University Town, Peshawar</span>
                  <span className="text-[10px] text-[#D99A32]">Opposite Town Club & Bilour Chowk</span>
                </div>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#FF8A1F] hover:underline font-bold inline-block"
              >
                Open in Google Maps & Get Directions →
              </a>
            </div>
          </div>

          {/* Right Message Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="p-8 sm:p-10 rounded-3xl bg-[#120B08] border border-[#FF8A1F]/25 space-y-5 shadow-2xl"
            >
              <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2 pb-4 border-b border-[#FF8A1F]/15">
                <MessageSquare size={20} className="text-[#FF8A1F]" />
                Send Us a Note or Inquiry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    placeholder="e.g. Asadullah Durrani"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-white focus:outline-none focus:border-[#FF8A1F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="name@example.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-white focus:outline-none focus:border-[#FF8A1F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    placeholder="03xx-xxxxxxx"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-white focus:outline-none focus:border-[#FF8A1F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Banquet Catering, Feedback..."
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-white focus:outline-none focus:border-[#FF8A1F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
                  Your Message / Comments *
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Share your experience, catering requirements, or any question..."
                  className="w-full p-3 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-white focus:outline-none focus:border-[#FF8A1F]"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSending}
                leftIcon={<Send size={16} />}
              >
                SUBMIT MESSAGE
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
