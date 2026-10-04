import React from 'react';
import { NotificationItem } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0f1422] border border-white/10 p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400 text-[22px]">notifications</span>
            <h2 className="font-outfit text-base font-bold text-white">اعلان‌ها و رویدادها</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-2.5">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">هیچ اعلانی وجود ندارد</div>
          ) : (
            notifications.map(item => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  item.read ? 'bg-white/[0.01] border-white/5 opacity-70' : 'bg-white/[0.04] border-cyan-400/20'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[17px]">
                    {item.type === 'streak'
                      ? 'bolt'
                      : item.type === 'achievement'
                      ? 'military_tech'
                      : 'info'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white truncate">{item.title}</span>
                    <span className="text-[10px] text-slate-500 shrink-0 font-outfit">{item.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.some(n => !n.read) && (
          <button
            onClick={onMarkAllRead}
            className="w-full mt-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-cyan-300 font-medium transition-all cursor-pointer"
          >
            علامت‌گذاری همه به عنوان خوانده‌شده
          </button>
        )}
      </div>
    </div>
  );
};
