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
    flame: 'bg-[#C97845]/15 text-[#D6A15D] border border-[#C97845]/30',
    gold: 'bg-[#D6A15D]/15 text-[#D6A15D] border border-[#D6A15D]/30',
    success: 'bg-[#7FA27A]/15 text-[#7FA27A] border border-[#7FA27A]/30',
    warning: 'bg-[#D6A15D]/15 text-[#D6A15D] border border-[#D6A15D]/30',
    danger: 'bg-[#B96F65]/15 text-[#B96F65] border border-[#B96F65]/30',
    neutral: 'bg-[#28221D] text-[#BDB1A5] border border-[#51463D]',
    'spice-mild': 'bg-[#7FA27A]/15 text-[#7FA27A] border border-[#7FA27A]/30',
    'spice-hot': 'bg-[#B96F65]/15 text-[#B96F65] border border-[#B96F65]/30',
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
