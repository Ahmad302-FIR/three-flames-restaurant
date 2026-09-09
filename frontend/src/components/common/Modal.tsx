import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-[#FFFFFF] border border-[#E8DED6] rounded-2xl shadow-2xl overflow-hidden z-10 my-8 text-[#25201D]`}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div className="flex items-start justify-between p-6 border-b border-[#E8DED6] bg-[#F7F3EE]">
            <div>
              {title && <h3 className="text-xl font-bold font-heading text-[#25201D]">{title}</h3>}
              {subtitle && <p className="text-xs text-[#6F6761] mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#6F6761] hover:text-[#25201D] hover:bg-[#F3E4DC] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {!title && !subtitle && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 rounded-full p-2 text-[#6F6761] hover:text-[#25201D] bg-[#F7F3EE] hover:bg-[#F3E4DC] border border-[#E8DED6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto text-[#25201D]">{children}</div>
      </div>
    </div>
  );
};
