import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Order } from '../types';
import { orderService } from '../services/orderService';
import { Button } from '../components/common/Button';
import { FlameIcon } from '../components/common/FlameIcon';
import { restaurantInfo } from '../../src/data/restaurantData';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  ShoppingBag,
  Share2,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const found = await orderService.getOrderById(id);
        setOrder(found);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080604] pt-36 pb-20 flex items-center justify-center text-[#FFF7ED]">
        <div className="flex flex-col items-center gap-3">
          <FlameIcon size={36} />
          <p className="text-sm font-semibold uppercase tracking-wider text-[#FF8A1F] animate-pulse">
            Retrieving Order Confirmation...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080604] pt-28 pb-20 text-[#FFF7ED]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#120B08] border border-[#FF8A1F]/30 p-8 sm:p-12 text-center space-y-8 shadow-2xl overflow-hidden">
          {/* Subtle Background Flare */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#F97316]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Success Icon */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[#1A100C] border-2 border-[#FF8A1F] flex items-center justify-center mb-4 shadow-xl shadow-[#F97316]/20">
              <FlameIcon size={44} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 size={14} />
              <span>Order Successfully Received</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-[#FFF7ED] uppercase tracking-wide">
              ORDER CONFIRMED!
            </h1>

            <p className="mt-2 text-sm sm:text-base text-[#B8AAA0] max-w-lg mx-auto leading-relaxed">
              Thank you for choosing Three Flames Restaurant. Our chefs are firing up the charcoal skewers and woks right now.
            </p>
          </div>

          {/* Order Reference Box */}
          <div className="p-6 rounded-2xl bg-[#1A100C] border border-[#FF8A1F]/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#B8AAA0] tracking-wider block">
                Order Number
              </span>
              <span className="text-xl font-extrabold text-[#FF8A1F]">
                #{order?.id || id}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#B8AAA0] tracking-wider block">
                Estimated Time
              </span>
              <span className="text-sm font-bold text-[#FFF7ED] flex items-center gap-1 mt-1">
                <Clock size={14} className="text-[#D99A32]" />
                {order?.estimatedTime || '30–45 minutes'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#B8AAA0] tracking-wider block">
                Payment Status
              </span>
              <span className="text-sm font-bold text-amber-300 capitalize mt-1 block">
                {order?.paymentMethod.replace(/_/g, ' ') || 'Cash on Delivery'}
              </span>
            </div>
          </div>

          {/* Items Summary */}
          {order && (
            <div className="p-6 rounded-2xl bg-[#1A100C]/60 border border-white/5 text-left space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D99A32] pb-2 border-b border-white/5">
                Ordered Items ({order.items.length})
              </h3>
              <div className="divide-y divide-white/5 text-xs space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex justify-between">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-bold text-white">Rs. {item.itemTotal.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between text-sm font-bold text-[#FF8A1F]">
                <span>Total Amount:</span>
                <span>Rs. {order.total.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate(`/track-order/${order?.id || id}`)}
              rightIcon={<ArrowRight size={18} />}
            >
              TRACK LIVE ORDER
            </Button>

            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => navigate('/menu')}
              leftIcon={<ShoppingBag size={18} />}
            >
              CONTINUE EXPLORING
            </Button>
          </div>

          {/* Helpline */}
          <div className="pt-4 border-t border-white/5 text-xs text-[#B8AAA0] flex items-center justify-center gap-4">
            <span>Questions? Call our front desk:</span>
            <a
              href={restaurantInfo.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF8A1F] font-bold hover:underline flex items-center gap-1"
              title="Chat on WhatsApp"
            >
              <Phone size={13} />
              {restaurantInfo.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
