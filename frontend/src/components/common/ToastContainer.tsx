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
          success: <CheckCircle2 className="w-5 h-5 text-[#7FA27A] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-[#B96F65] shrink-0" />,
          warning: <Flame className="w-5 h-5 text-[#D6A15D] shrink-0" />,
          info: <Info className="w-5 h-5 text-[#D6A15D] shrink-0" />,
        };

        const borders = {
          success: 'border-[#7FA27A]/50 shadow-black/30',
          error: 'border-[#B96F65]/50 shadow-black/30',
          warning: 'border-[#D6A15D]/50 shadow-black/30',
          info: 'border-[#51463D] shadow-black/30',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-[#28221D]/95 backdrop-blur-md border ${borders[toast.type]} shadow-xl text-[#F3EDE5] transition-all duration-300 transform translate-y-0 opacity-100`}
          >
            {icons[toast.type]}
            <div className="flex-1 text-sm">
              {toast.title && <div className="font-semibold text-[#F3EDE5] mb-0.5">{toast.title}</div>}
              <div className="text-[#BDB1A5] text-xs leading-relaxed">{toast.message}</div>
            </div>
            <button
              onClick={() => dispatch(removeToast(toast.id))}
              className="text-[#BDB1A5] hover:text-[#F3EDE5] transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
