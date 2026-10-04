import React from 'react';
import { ActiveTab } from '../../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onQuickAdd?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'today', label: 'امروز', icon: 'dashboard' },
    { id: 'tasks', label: 'کارها', icon: 'check_circle' },
    { id: 'habits', label: 'عادات', icon: 'auto_awesome' },
    { id: 'smart', label: 'هوشمند', icon: 'psychology' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#0a0e17]/90 backdrop-blur-2xl border-t border-white/5 shadow-[0_-8px_32px_rgba(0,0,0,0.7)]">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 sm:h-20 px-3">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[58px] min-h-[44px] transition-all cursor-pointer ${
                isActive
                  ? 'text-cyan-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[24px] ${
                  isActive ? 'material-symbols-filled' : ''
                }`}
              >
                {tab.icon}
              </span>
              <span className="font-outfit text-xs tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 -mt-0.5 shadow-[0_0_8px_#00f2fe]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
