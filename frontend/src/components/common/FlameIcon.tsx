import React from 'react';

interface FlameIconProps {
  className?: string;
  size?: number;
  glow?: boolean;
  variant?: 'dark' | 'light';
}

export const FlameIcon: React.FC<FlameIconProps> = ({
  className = '',
  size = 28,
  glow = false,
  variant = 'dark',
}) => {
  const logoSrc = variant === 'light' ? '/akr-logo-light.png' : '/akr-logo.png';

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 relative ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      {glow && (
        <span className="absolute inset-0 bg-[#B85C38]/20 blur-sm rounded-full -z-10 animate-pulse" />
      )}
      <img
        src={logoSrc}
        alt="AKR Logo"
        className="w-full h-full object-contain drop-shadow-sm"
      />
    </span>
  );
};

