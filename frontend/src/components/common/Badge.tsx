import React from 'react';
import { OrderStatus, ReservationStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'flame' | 'gold' | 'success' | 'warning' | 'danger' | 'neutral' | 'spice-mild' | 'spice-hot';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'flame',
  size = 'sm',
  className = '',
}) => {
  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
  };

  const variantStyles = {
    flame: 'bg-[#F97316]/15 text-[#FF8A1F] border border-[#F97316]/40',
    gold: 'bg-[#D99A32]/15 text-[#F2B84B] border border-[#D99A32]/40',
    success: 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-950/80 text-amber-300 border border-amber-500/30',
    danger: 'bg-rose-950/80 text-rose-300 border border-rose-500/30',
    neutral: 'bg-[#1A100C] text-[#B8AAA0] border border-white/10',
    'spice-mild': 'bg-teal-950/70 text-teal-300 border border-teal-500/30',
    'spice-hot': 'bg-red-950/80 text-red-400 border border-red-500/40',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="warning">Order Placed</Badge>;
    case 'confirmed':
      return <Badge variant="gold">Confirmed</Badge>;
    case 'preparing':
      return <Badge variant="flame">On Flame 🔥</Badge>;
    case 'ready':
      return <Badge variant="gold">Ready</Badge>;
    case 'out_for_delivery':
      return <Badge variant="flame">Out for Delivery 🛵</Badge>;
    case 'delivered':
      return <Badge variant="success">Delivered ✓</Badge>;
    case 'cancelled':
      return <Badge variant="danger">Cancelled</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

export const ReservationStatusBadge: React.FC<{ status: ReservationStatus }> = ({ status }) => {
  switch (status) {
    case 'confirmed':
      return <Badge variant="success">Confirmed ✓</Badge>;
    case 'pending':
      return <Badge variant="warning">Awaiting Approval</Badge>;
    case 'completed':
      return <Badge variant="neutral">Completed</Badge>;
    case 'rejected':
      return <Badge variant="danger">Declined</Badge>;
    case 'cancelled':
      return <Badge variant="danger">Cancelled</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};
