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
    flame: 'bg-[#F3E4DC] text-[#B85C38] border border-[#E8DED6]',
    gold: 'bg-[#F3E4DC] text-[#8F432B] border border-[#E8DED6]',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    neutral: 'bg-[#F7F3EE] text-[#6F6761] border border-[#E8DED6]',
    'spice-mild': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'spice-hot': 'bg-rose-50 text-rose-700 border border-rose-200',
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
