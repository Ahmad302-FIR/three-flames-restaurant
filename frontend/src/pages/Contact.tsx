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
    <div className="min-h-screen bg-[#FFFDFC] pt-28 pb-20 text-[#25201D]">
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
            <div className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] space-y-6 shadow-2xl">
              <h3 className="text-xl font-bold font-heading text-[#25201D] flex items-center gap-2 pb-4 border-b border-[#E8DED6]">
                <FlameIcon size={20} />
                Restaurant Headquarters
              </h3>

              <div className="space-y-5 text-xs sm:text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] flex items-center justify-center text-[#B85C38] shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-[#25201D] block">Physical Address</span>
                    <span className="text-[#6F6761] leading-relaxed block mt-0.5">
                      {restaurantInfo.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <a
                    href={restaurantInfo.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] flex items-center justify-center text-[#B85C38] hover:bg-[#B85C38]/20 hover:border-[#E8DED6] transition-all shrink-0"
                    title="Chat on WhatsApp"
                    aria-label="Chat on WhatsApp"
                  >
                    <Phone size={20} />
                  </a>
                  <div>
                    <span className="font-bold text-[#25201D] block">Helpline & WhatsApp</span>
                    <a
                      href={restaurantInfo.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#B85C38] font-bold hover:underline block mt-0.5"
                    >
                      {restaurantInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] flex items-center justify-center text-[#B85C38] shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-[#25201D] block">Email Support</span>
                    <a
                      href={`mailto:${restaurantInfo.email}`}
                      className="text-[#6F6761] hover:text-[#25201D] block mt-0.5"
                    >
                      {restaurantInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] flex items-center justify-center text-[#B85C38] shrink-0 mt-0.5">
                    <Clock size={20} />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <span className="font-bold text-[#25201D] block">Service Hours</span>
                    <div className="text-xs text-[#6F6761] space-y-1">
                      <div className="flex items-center justify-between gap-2 border-b border-[#E8DED6] pb-1">
                        <span>Monday – Thursday:</span>
                        <span className="text-[#25201D] font-bold">{restaurantInfo.openingHours.monday_thursday}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 border-b border-[#E8DED6] pb-1">
                        <span>Friday:</span>
                        <span className="text-[#25201D] font-bold">{restaurantInfo.openingHours.friday}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span>Saturday – Sunday:</span>
                        <span className="text-[#25201D] font-bold">{restaurantInfo.openingHours.saturday_sunday}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Preview Frame */}
            <div className="rounded-3xl overflow-hidden border border-[#E8DED6] bg-[#FFFFFF] p-4 text-center space-y-3">
              <div className="h-48 rounded-2xl bg-[#F7F3EE] relative flex items-center justify-center overflow-hidden border border-[#E8DED6]">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop"
                  alt="Peshawar Map Location"
                  className="w-full h-full object-cover opacity-40"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#FFFDFC]/60 flex flex-col items-center justify-center p-4">
                  <MapPin size={32} className="text-[#B85C38] animate-bounce" />
                  <span className="text-xs font-bold text-[#25201D] mt-1">University Town, Peshawar</span>
                  <span className="text-[10px] text-[#B85C38]">Opposite Town Club & Bilour Chowk</span>
                </div>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#B85C38] hover:underline font-bold inline-block"
              >
                Open in Google Maps & Get Directions →
              </a>
            </div>
          </div>

          {/* Right Message Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="p-8 sm:p-10 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] space-y-5 shadow-2xl"
            >
              <h3 className="text-xl font-bold font-heading text-[#25201D] flex items-center gap-2 pb-4 border-b border-[#E8DED6]">
                <MessageSquare size={20} className="text-[#B85C38]" />
                Send Us a Note or Inquiry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    placeholder="e.g. Asadullah Durrani"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#B85C38]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="name@example.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#B85C38]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    placeholder="03xx-xxxxxxx"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#B85C38]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Banquet Catering, Feedback..."
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#B85C38]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#6F6761] block mb-1.5">
                  Your Message / Comments *
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Share your experience, catering requirements, or any question..."
                  className="w-full p-3 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs text-[#25201D] placeholder-[#6F6761]/60 focus:outline-none focus:border-[#B85C38]"
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
