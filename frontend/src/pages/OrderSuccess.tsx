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
  Phone,
  ArrowRight,
  ShoppingBag,
  Copy,
  BookmarkCheck,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const orderNumber = order?.id || id || '';

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

    // Remember recent order ID locally for convenient guest tracking later
    if (id) {
      try {
        localStorage.setItem('tf_recent_order_id', id);
      } catch {
        // Safe fallback for private browsing mode
      }
    }
  }, [id]);

  const handleCopyOrderId = async () => {
    if (!orderNumber) return;
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDFC] pt-36 pb-20 flex items-center justify-center text-[#25201D]">
        <div className="flex flex-col items-center gap-3">
          <FlameIcon size={36} />
          <p className="text-sm font-semibold uppercase tracking-wider text-[#B85C38] animate-pulse">
            Retrieving Order Confirmation...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDFC] pt-28 pb-20 text-[#25201D]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] p-6 sm:p-10 md:p-12 text-center space-y-8 shadow-2xl overflow-hidden">
          {/* Subtle Background Flare */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#B85C38]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Success Header Icon */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[#F7F3EE] border-2 border-[#E8DED6] flex items-center justify-center mb-4 shadow-md">
              <img src="/akr-logo.png" alt="AKR" className="h-14 w-auto object-contain" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 size={14} />
              <span>Order Successfully Received</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-[#25201D] uppercase tracking-wide">
              ORDER CONFIRMED!
            </h1>

            <p className="text-xs sm:text-sm text-[#6F6761] max-w-lg mx-auto leading-relaxed">
              Thank you for dining with Ahmed Khan Restaurant. Our pitmasters have received your ticket and are firing up the charcoal grill!
            </p>
          </div>

          {/* Prominently Featured Order Number Card */}
          <div className="relative z-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#FFFFFF] via-[#FFFFFF] to-[#FFFDFC] border-2 border-[#E8DED6] shadow-2xl space-y-4">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#B85C38] block">
              Your Order Number
            </span>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-[#B85C38] tracking-wider">
                #{orderNumber}
              </span>
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="px-3.5 py-2 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-xs font-semibold text-[#25201D] hover:bg-[#B85C38]/20 hover:border-[#E8DED6] transition-all flex items-center gap-1.5 active:scale-95"
                title="Copy Order ID"
              >
                <Copy size={14} className="text-[#B85C38]" />
                <span>{copied ? 'Copied!' : 'Copy Order ID'}</span>
              </button>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B85C38]/10 border border-[#E8DED6] text-xs text-[#B85C38] font-semibold">
              <BookmarkCheck size={15} className="shrink-0" />
              <span>Save your Order ID to track your order later.</span>
            </div>

            <p className="text-xs text-[#6F6761] max-w-md mx-auto leading-relaxed">
              Ordered as a guest? You can track this order anytime from the{' '}
              <Link to="/track-order" className="text-[#B85C38] font-semibold underline hover:text-[#25201D]">
                Track Order
              </Link>{' '}
              link in the top menu or website footer by entering <strong className="text-[#25201D]">#{orderNumber}</strong>.
            </p>
          </div>

          {/* Order Details Quick Strip */}
          <div className="p-5 rounded-2xl bg-[#F7F3EE] border border-[#E8DED6] grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#6F6761] tracking-wider block">
                Fulfillment Type
              </span>
              <span className="text-sm font-bold text-[#25201D] capitalize mt-1 block">
                {order?.orderType || 'Delivery'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#6F6761] tracking-wider block">
                Estimated Time
              </span>
              <span className="text-sm font-bold text-[#25201D] flex items-center gap-1 mt-1">
                <Clock size={14} className="text-[#B85C38]" />
                {order?.estimatedTime || '30–45 minutes'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#6F6761] tracking-wider block">
                Payment Method
              </span>
              <span className="text-sm font-bold text-[#25201D] capitalize mt-1 block">
                {order?.paymentMethod.replace(/_/g, ' ') || 'Cash on Delivery'}
              </span>
            </div>
          </div>

          {/* Items Summary */}
          {order && (
            <div className="p-6 rounded-2xl bg-[#F7F3EE]/60 border border-[#E8DED6] text-left space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#B85C38] pb-2 border-b border-[#E8DED6]">
                Ordered Items ({order.items.length})
              </h3>
              <div className="divide-y divide-[#E8DED6] text-xs space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex justify-between">
                    <span className="text-[#25201D] font-medium">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-bold text-[#25201D]">Rs. {item.itemTotal.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-[#E8DED6] flex justify-between text-sm font-bold text-[#B85C38]">
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
              onClick={() => navigate(`/track-order/${orderNumber}`)}
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

          {/* Helpline / Support */}
          <div className="pt-4 border-t border-[#E8DED6] text-xs text-[#6F6761] flex items-center justify-center gap-4">
            <span>Questions about your order? Call our kitchen desk:</span>
            <a
              href={restaurantInfo.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B85C38] font-bold hover:underline flex items-center gap-1"
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
