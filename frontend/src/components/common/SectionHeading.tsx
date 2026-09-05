import React from 'react';
import { FlameIcon } from './FlameIcon';

interface SectionHeadingProps {
  badgeText?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left' | 'right';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badgeText,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const alignmentClasses = {
    center: 'text-center items-center mx-auto',
    left: 'text-left items-start',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div className={`flex flex-col max-w-3xl mb-12 ${alignmentClasses[align]} ${className}`}>
      {badgeText && (
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A100C] border border-[#FF8A1F]/30 text-[#FF8A1F] text-xs font-semibold uppercase tracking-widest mb-3">
          <FlameIcon size={14} glow={false} />
          <span>{badgeText}</span>
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-[#FFF7ED] font-heading leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-[#B8AAA0] max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={`mt-4 flex items-center gap-2 ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#F97316] to-transparent" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A1F] shadow-[0_0_8px_#F97316]" />
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#F97316] to-transparent" />
      </div>
    </div>
  );
};
