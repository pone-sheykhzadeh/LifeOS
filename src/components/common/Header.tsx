import React from 'react';
import { UserProfile, ActiveTab } from '../../types';

interface HeaderProps {
  user: UserProfile;
  activeTab: ActiveTab;
  unreadNotifsCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeTab,
  unreadNotifsCount,
  onOpenNotifications,
  onOpenProfile,
}) => {
  const getTabLabel = () => {
    switch (activeTab) {
      case 'today':
        return 'Today Dashboard';
      case 'tasks':
        return 'تسک‌ها و اهداف';
      case 'habits':
        return 'عادات و سبک زندگی';
      case 'smart':
        return 'دستیار هوشمند';
      default:
        return 'Today Dashboard';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#0a0e17]/90 backdrop-blur-xl pt-safe border-b border-white/5 transition-all">
      <div className="max-w-4xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Right side in RTL (Brand & Active screen tag) */}
        <div className="flex items-center gap-2.5">
          <img
            alt="LifeOS Logo"
            className="h-8 w-auto object-contain drop-shadow-[0_0_8px_rgba(0,242,254,0.4)]"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UfvV0o6PDoc1V8hh0bDdx5KT8c8aPtzQVoFshfwXyLRYC_h_5bxqR52rA8tN1H2SONOzqpaoeTLPvnhkhxCaU_fh2xRFei0OSecPE8j2nTvoXk6bGJvqOWm9RKBXjKVlHlxIpvueUCCCWFnwLpBT1hYRtXsVCmZDqD9c923IG3V-q-ojPQdxt9NyNZHPQtgZNQUffmqZO-ZDF-nwCXDmSTPdM_sT038h9CpI-EAOTBIXcmqTZVV4cvSHM"
          />
          <span className="font-outfit text-xl font-bold text-white tracking-tight">LifeOS</span>
          <span className="text-xs text-cyan-300/85 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 font-medium font-outfit">
            {getTabLabel()}
          </span>
        </div>

        {/* Left side in RTL (Notifications & Profile) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenNotifications}
            aria-label="اعلان‌ها"
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors bg-white/[0.03] border border-white/10 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px]">notifications</span>
            {unreadNotifsCount > 0 && (
              <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2fe]" />
            )}
          </button>

          <button
            onClick={onOpenProfile}
            aria-label="پروفایل کاربری"
            className="relative flex items-center justify-center rounded-full ring-2 ring-cyan-400/40 hover:ring-cyan-300 transition-all active:scale-95 cursor-pointer"
            title={`${user.name} - ${user.roleTitle}`}
          >
            <img
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
              src={user.avatarUrl}
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0a0e17] rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
};
