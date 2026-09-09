import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { removeToast } from '../../store/slices/uiSlice';
import { CheckCircle2, AlertCircle, Info, X, Flame } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.ui.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-[#4E8A57] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-[#C24838] shrink-0" />,
          warning: <Flame className="w-5 h-5 text-[#B85C38] shrink-0" />,
          info: <Info className="w-5 h-5 text-[#B85C38] shrink-0" />,
        };

        const borders = {
          success: 'border-[#4E8A57]/40 shadow-sm',
          error: 'border-[#C24838]/40 shadow-sm',
          warning: 'border-[#B85C38]/40 shadow-sm',
          info: 'border-[#E8DED6] shadow-sm',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-[#FFFDFC]/95 backdrop-blur-md border ${borders[toast.type]} shadow-lg text-[#25201D] transition-all duration-300 transform translate-y-0 opacity-100`}
          >
            {icons[toast.type]}
            <div className="flex-1 text-sm">
              {toast.title && <div className="font-semibold text-[#25201D] mb-0.5">{toast.title}</div>}
              <div className="text-[#6F6761] text-xs leading-relaxed">{toast.message}</div>
            </div>
            <button
              onClick={() => dispatch(removeToast(toast.id))}
              className="text-[#6F6761] hover:text-[#25201D] transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
