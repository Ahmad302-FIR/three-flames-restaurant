import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-lg gap-2 tracking-wide',
    lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5 font-semibold tracking-wider',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#F97316] via-[#FF8A1F] to-[#EA580C] text-black font-semibold shadow-lg shadow-[#F97316]/20 hover:shadow-[#F97316]/40 hover:brightness-110 border border-[#FF8A1F]/30',
    secondary:
      'bg-[#1A100C] text-[#FFF7ED] border border-[#FF8A1F]/30 hover:bg-[#2A1A14] hover:border-[#FF8A1F]/60 shadow-md',
    outline:
      'bg-transparent text-[#FF8A1F] border border-[#FF8A1F]/50 hover:bg-[#FF8A1F]/10 hover:border-[#FF8A1F]',
    gold:
      'bg-gradient-to-r from-[#D99A32] to-[#F2B84B] text-black font-semibold shadow-lg shadow-[#D99A32]/20 hover:brightness-110 border border-[#F2B84B]/40',
    ghost:
      'bg-transparent text-[#FFF7ED] hover:bg-[#1A100C] hover:text-[#FF8A1F]',
    danger:
      'bg-red-600/90 text-white hover:bg-red-600 border border-red-500/30',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
