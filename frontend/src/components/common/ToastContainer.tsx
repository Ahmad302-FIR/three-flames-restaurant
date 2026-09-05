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
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          warning: <Flame className="w-5 h-5 text-[#FF8A1F] shrink-0" />,
          info: <Info className="w-5 h-5 text-amber-400 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-500/40 shadow-emerald-950/40',
          error: 'border-rose-500/40 shadow-rose-950/40',
          warning: 'border-[#FF8A1F]/50 shadow-[#F97316]/20',
          info: 'border-amber-500/40 shadow-amber-950/40',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-[#120B08]/95 backdrop-blur-md border ${borders[toast.type]} shadow-xl text-[#FFF7ED] transition-all duration-300 transform translate-y-0 opacity-100`}
          >
            {icons[toast.type]}
            <div className="flex-1 text-sm">
              {toast.title && <div className="font-semibold text-white mb-0.5">{toast.title}</div>}
              <div className="text-[#B8AAA0] text-xs leading-relaxed">{toast.message}</div>
            </div>
            <button
              onClick={() => dispatch(removeToast(toast.id))}
              className="text-[#B8AAA0] hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
