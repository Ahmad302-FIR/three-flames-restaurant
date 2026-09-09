import React from 'react';
import { FlameIcon } from './FlameIcon';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-[#FFFFFF] border border-[#E8DED6] shadow-sm max-w-lg mx-auto ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-[#F3E4DC] border border-[#E8DED6] flex items-center justify-center mb-6 shadow-inner text-[#B85C38]">
        {icon || <FlameIcon size={32} />}
      </div>
      <h3 className="text-xl font-bold font-heading text-[#25201D] mb-2">{title}</h3>
      <p className="text-sm text-[#6F6761] max-w-sm leading-relaxed mb-6">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
