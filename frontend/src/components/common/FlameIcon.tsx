import React from 'react';

interface FlameIconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const FlameIcon: React.FC<FlameIconProps> = ({ className = 'w-6 h-6', size, glow = true }) => {
  return (
    <span className={`inline-flex items-center justify-center relative ${className}`} style={size ? { width: size, height: size } : undefined}>
      {glow && (
        <span className="absolute inset-0 bg-[#C97845]/20 blur-sm rounded-full -z-10 animate-pulse" />
      )}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-[#C97845] drop-shadow-[0_0_8px_rgba(201,120,69,0.35)]"
      >
        <path
          d="M12 2C9.5 6.5 12 9.5 9 12C7.5 13.25 6 15 6 17.5C6 20.5 8.7 23 12 23C15.3 23 18 20.5 18 17.5C18 13.5 14.5 11 15 7C14 8.5 13 9.5 12 10.5C11.5 8 13.5 5 12 2Z"
          fill="url(#threeFlamesGrad)"
        />
        <path
          d="M12 15C10.9 15 10 15.9 10 17C10 18.1 10.9 19 12 19C13.1 19 14 18.1 14 17C14 15.9 13.1 15 12 15Z"
          fill="#F3EDE5"
          opacity="0.9"
        />
        <defs>
          <linearGradient id="threeFlamesGrad" x1="6" y1="2" x2="18" y2="23" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D6A15D" />
            <stop offset="0.5" stopColor="#C97845" />
            <stop offset="1" stopColor="#A85E54" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
};
