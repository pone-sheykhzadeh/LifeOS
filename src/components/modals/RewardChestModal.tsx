import React, { useState } from 'react';
import { Achievement } from '../../types';
import confetti from 'canvas-confetti';

interface RewardChestModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  onClaimWeeklyChest: () => void;
}

export const RewardChestModal: React.FC<RewardChestModalProps> = ({
  isOpen,
  onClose,
  achievements,
  onClaimWeeklyChest,
}) => {
  const [claimed, setClaimed] = useState(false);

  if (!isOpen) return null;

  const handleClaim = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#00f2fe', '#8b5cf6', '#fbbf24', '#10b981'],
    });
    setClaimed(true);
    onClaimWeeklyChest();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0f1422] border border-purple-500/30 p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glows */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer z-10"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header Hero */}
        <div className="flex flex-col items-center text-center mt-2 mb-4">
          <div className="relative w-24 h-24 rounded-2xl bg-[#141026] border border-purple-400/40 p-2 shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center justify-center mb-3">
            <img
              alt="Treasure chest"
              className="w-20 h-20 object-cover rounded-xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMtJi0h98RlA7RKC-QYXcnSgJz9KuIK_BzIP1Zn8Sb9RFhCfEuAYbzpEH_9gli6IC-WtOegQvCXdMCuVVr3dQtrzn2_VoeywDQCZD5lYuonkLooAvRA1nMc-5wDSPUC5oYZkQWl_HfshMUukuvVcOgba-fq2NiZyGwmfELS0pGrvMNWyl-_T3kW0lp1krOD4aclIaknYia0cDTdyWPmETRFbunANtLi8V6yYqnEs8vxDHi0E4AFpPU"
            />
            <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] shadow">
              ویژه هفتگی
            </span>
          </div>

          <h2 className="font-outfit text-xl font-bold text-white tracking-tight">
            تالار افتخارات و صندوقچه پاداش
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            با تکمیل ماموریت‌های روزانه و حفظ زنجیره عادات، امتیازهای بوست‌شده و مدال‌های حماسی را آزاد کنید.
          </p>

          <button
            onClick={handleClaim}
            disabled={claimed}
            className={`mt-4 px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              claimed
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                : 'bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 text-[#00373a] shadow-[0_0_15px_rgba(0,242,254,0.4)] hover:brightness-110 active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {claimed ? 'check_circle' : 'redeem'}
            </span>
            <span>{claimed ? 'پاداش دریافت شد (+۵۰۰ XP)' : 'دریافت پاداش صندوقچه هفتگی'}</span>
          </button>
        </div>

        {/* Badges List */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 my-2">
          <span className="text-xs font-semibold text-slate-300">مدال‌ها و نشان‌های کسب‌شده:</span>
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                ach.unlocked || (ach.id === 'ach-legendary-explorer' && claimed)
                  ? 'bg-purple-950/20 border-purple-500/30'
                  : 'bg-white/[0.02] border-white/5 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    ach.unlocked || (ach.id === 'ach-legendary-explorer' && claimed)
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-white/5 text-slate-500'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{ach.icon}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white truncate">{ach.title}</span>
                    {ach.unlocked || (ach.id === 'ach-legendary-explorer' && claimed) ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">
                        باز شد ✨
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                        {ach.progress} از {ach.maxProgress}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5 truncate">{ach.description}</span>
                </div>
              </div>
              <span className="text-xs font-outfit font-bold text-amber-400 shrink-0 px-2.5 py-1 rounded-xl bg-amber-400/10 border border-amber-400/20">
                +{ach.xpReward} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
