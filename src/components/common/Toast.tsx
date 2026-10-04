import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  type?: 'success' | 'xp' | 'reward' | 'info';
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto z-50 transition-all duration-300 transform translate-y-0 opacity-100 flex items-center justify-between rounded-2xl bg-[#141b2a] border border-cyan-400/50 shadow-2xl p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl animate-bounce">
          {toast.icon || '⚡'}
        </span>
        <div className="flex flex-col text-right">
          <span className="font-outfit text-[15px] text-white font-bold tracking-tight">
            {toast.title}
          </span>
          {toast.subtitle && (
            <span className="text-xs text-slate-400 mt-0.5">
              {toast.subtitle}
            </span>
          )}
        </div>
      </div>
      <span className="material-symbols-outlined text-cyan-400 text-[26px] drop-shadow-[0_0_8px_rgba(0,242,254,0.6)]">
        verified
      </span>
    </div>
  );
};
