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
      'bg-[#B85C38] hover:bg-[#8F432B] text-white font-semibold shadow-sm hover:shadow-md transition-all border border-[#B85C38]',
    secondary:
      'bg-[#FFFDFC] text-[#25201D] border border-[#E8DED6] hover:bg-[#F3E4DC] hover:border-[#B85C38]/40 shadow-sm transition-all',
    outline:
      'bg-transparent text-[#B85C38] border border-[#B85C38] hover:bg-[#F3E4DC] hover:text-[#8F432B] transition-all',
    gold:
      'bg-[#F3E4DC] text-[#B85C38] font-semibold shadow-sm hover:bg-[#B85C38] hover:text-white border border-[#E8DED6] transition-all',
    ghost:
      'bg-transparent text-[#25201D] hover:bg-[#F7F3EE] hover:text-[#B85C38] transition-all',
    danger:
      'bg-[#C24838] text-white hover:bg-[#A8382A] border border-[#C24838] shadow-sm transition-all',
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
