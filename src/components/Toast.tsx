import React from 'react';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onViewCart?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onViewCart }) => {
  if (!message) return null;

  return (
    <div className="fixed top-14 inset-x-0 mx-auto w-[90%] max-w-[360px] z-50 pointer-events-auto">
      <div className="bg-[#182115] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between border border-white/10 animate-in slide-in-from-top duration-300">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#FF5722] flex items-center justify-center text-white shrink-0">
            <CheckCircle2 size={16} />
          </div>
          <span className="text-xs font-semibold tracking-tight">{message}</span>
        </div>
        {onViewCart && (
          <button
            onClick={onViewCart}
            className="text-[11px] font-bold text-[#A1CD4C] hover:text-white flex items-center gap-1 ml-2 underline underline-offset-2 cursor-pointer"
          >
            <ShoppingBag size={12} />
            <span>Bag</span>
          </button>
        )}
      </div>
    </div>
  );
};
