import React, { useState } from 'react';
import { Task, TaskCategory, UserProfile } from '../../types';
import { AnimatedSvgBadge } from '../common/AnimatedSvgBadge';

interface TasksScreenProps {
  tasks: Task[];
  user: UserProfile;
  onToggleTask: (id: string) => void;
  onQuickAdd: (title: string, category: TaskCategory) => void;
  onOpenTaskModal: (task?: Task) => void;
  onOpenRewardChest: () => void;
}

export const TasksScreen: React.FC<TasksScreenProps> = ({
  tasks,
  user,
  onToggleTask,
  onQuickAdd,
  onOpenTaskModal,
  onOpenRewardChest,
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [activePriority, setActivePriority] = useState<TaskCategory>('cyan' as unknown as TaskCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const remainingCount = totalTasks - completedTasks;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onQuickAdd(quickInput.trim(), activePriority);
    setQuickInput('');
  };

  // Filter tasks based on search, category, and completion status
  const filteredTasks = tasks.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.contextNote && t.contextNote.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategoryFilter === 'all' || t.category === selectedCategoryFilter;

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? !t.completed
        : t.completed;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const criticalTasks = filteredTasks.filter(t => t.category === 'critical');
  const techTasks = filteredTasks.filter(t => t.category === 'tech');
  const growthTasks = filteredTasks.filter(t => t.category === 'growth');
  const healthTasks = filteredTasks.filter(t => t.category === 'health');

  const priorityConfigs: Record<
    TaskCategory,
    {
      color: string;
      dotClass: string;
      ringClass: string;
      label: string;
      badgeText: string;
      badgeClass: string;
      borderClass: string;
      checkboxBorder: string;
      checkboxText: string;
      xpPreset: string;
    }
  > = {
    critical: {
      color: '#f43f5e',
      dotClass: 'bg-rose-500',
      ringClass: 'ring-rose-400 ring-offset-2 ring-offset-[#0a0e17]',
      label: 'ماموریت‌های کلیدی و فوری',
      badgeText: 'اولویت بحرانی 🔥',
      badgeClass: 'bg-rose-950/60 text-rose-300 border-rose-800/40',
      borderClass: 'border-rose-500/20 border-r-4 border-r-rose-500',
      checkboxBorder: 'border-rose-500/50 hover:border-rose-400',
      checkboxText: 'text-rose-400',
      xpPreset: '+۲۰۰ XP',
    },
    tech: {
      color: '#00f2fe',
      dotClass: 'bg-cyan-400',
      ringClass: 'ring-cyan-300 ring-offset-2 ring-offset-[#0a0e17]',
      label: 'پروژه‌ها و توسعه فنی',
      badgeText: 'Cyber Cyan ⚡',
      badgeClass: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/40',
      borderClass: 'border-cyan-500/20 border-r-4 border-r-cyan-400',
      checkboxBorder: 'border-cyan-400/50 hover:border-cyan-300',
      checkboxText: 'text-cyan-400',
      xpPreset: '+۱۵۰ XP',
    },
    growth: {
      color: '#c084fc',
      dotClass: 'bg-purple-400',
      ringClass: 'ring-purple-400 ring-offset-2 ring-offset-[#0a0e17]',
      label: 'رشد فردی و یادگیری',
      badgeText: 'Electric Violet 🔮',
      badgeClass: 'bg-purple-950/60 text-purple-300 border-purple-800/40',
      borderClass: 'border-purple-500/20 border-r-4 border-r-purple-500',
      checkboxBorder: 'border-purple-400/50 hover:border-purple-300',
      checkboxText: 'text-purple-400',
      xpPreset: '+۱۲۰ XP',
    },
    health: {
      color: '#34d399',
      dotClass: 'bg-emerald-400',
      ringClass: 'ring-emerald-400 ring-offset-2 ring-offset-[#0a0e17]',
      label: 'سلامتی و توازن زیستی',
      badgeText: 'Emerald Glow 🌿',
      badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40',
      borderClass: 'border-emerald-500/20 border-r-4 border-r-emerald-500',
      checkboxBorder: 'border-emerald-400/50 hover:border-emerald-300',
      checkboxText: 'text-emerald-400',
      xpPreset: '+۱۰۰ XP',
    },
  };

  const renderTaskSection = (
    categoryKey: TaskCategory,
    taskList: Task[],
    categoryDotColor: string
  ) => {
    const config = priorityConfigs[categoryKey];
    if (taskList.length === 0 && selectedCategoryFilter !== 'all') return null;

    return (
      <section className="flex flex-col gap-3">
        {/* Section Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${categoryDotColor} shadow-[0_0_8px_currentColor]`}
            />
            <h2 className="text-[16px] font-bold text-white flex items-center gap-1.5">
              <span>{config.label}</span>
              <span className="text-xs text-slate-400 font-mono font-normal">
                ({taskList.length} مورد)
              </span>
            </h2>
          </div>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${config.badgeClass}`}
          >
            {config.badgeText}
          </span>
        </div>

        {/* Task Items */}
        <div className="flex flex-col gap-2.5">
          {taskList.length === 0 ? (
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-center text-xs text-slate-500">
              موردی در این دسته‌بندی یافت نشد
            </div>
          ) : (
            taskList.map(task => {
              return (
                <div
                  key={task.id}
                  className={`task-item group relative overflow-hidden rounded-2xl p-4 transition-all duration-200 border shadow-lg ${
                    task.completed
                      ? 'bg-white/[0.01] border-white/5 opacity-60'
                      : `bg-[#131826] hover:bg-[#161c2c] ${config.borderClass}`
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Checkbox */}
                    <button
                      onClick={() => onToggleTask(task.id)}
                      aria-label="علامت زدن ماموریت"
                      className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all active:scale-90 shrink-0 ${
                        task.completed
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-400'
                          : `${config.checkboxBorder} text-slate-500 hover:text-white`
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] transition-all ${
                          task.completed ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                        }`}
                      >
                        done
                      </span>
                    </button>

                    {/* Task Title & Details */}
                    <div className="task-content flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          onClick={() => onOpenTaskModal(task)}
                          className={`font-semibold text-[15px] cursor-pointer transition-all ${
                            task.completed
                              ? 'text-slate-400 line-through'
                              : 'text-white hover:text-cyan-300'
                          }`}
                        >
                          {task.title}
                        </span>

                        {categoryKey === 'critical' && !task.completed && (
                          <span className="material-symbols-outlined text-[17px] text-amber-300 material-symbols-filled">
                            star
                          </span>
                        )}

                        {task.completed && (
                          <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                            انجام شد ✓
                          </span>
                        )}
                      </div>

                      {/* Micro Progress Bar if present */}
                      {task.progressPercent !== undefined && !task.completed && (
                        <div className="flex items-center gap-2.5 mt-2 max-w-xs">
                          <div className="flex-1 bg-[#101928] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-cyan-400 h-full rounded-full shadow-[0_0_8px_#00f2fe]"
                              style={{ width: `${task.progressPercent}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-mono text-cyan-300 font-outfit">
                            {task.progressPercent}٪
                          </span>
                        </div>
                      )}

                      {/* Time and Notes */}
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1 font-body-sm">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {task.timeLabel}
                        </span>
                        {task.contextNote && (
                          <>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-400 truncate">{task.contextNote}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* XP Badge */}
                    <span
                      className={`shrink-0 px-2.5 py-1 rounded-xl font-outfit text-xs font-bold border shadow-sm ${
                        task.completed
                          ? 'bg-white/[0.02] text-slate-500 border-white/5'
                          : 'bg-white/[0.03] text-slate-300 border-white/10'
                      }`}
                    >
                      +{task.xp} XP
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 py-5 gap-6 max-w-4xl mx-auto">
      {/* 1. Status Overview & Animated Progress Showcase */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#121724] via-[#10141f] to-[#0a0e17] p-5 border border-white/5 shadow-2xl">
        <div className="absolute -top-14 -left-14 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <AnimatedSvgBadge className="w-15 h-15 sm:w-16 sm:h-16" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[17px] sm:text-[19px] font-bold text-white tracking-tight">
                  امروز: {completedTasks} از {totalTasks} ماموریت
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium border border-emerald-500/30 font-outfit">
                  {completionPercent}٪ انجام شده
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {remainingCount > 0
                  ? `ریتم فوق‌العاده داری، ${remainingCount} ماموریت تا مدال طلایی روزانه! ⚡`
                  : 'تبریک! تمام ماموریت‌های روزانه تسخیر شدند 🎉'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center justify-center bg-white/[0.03] px-3 py-2 rounded-xl border border-white/5 shadow-inner">
            <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1 font-outfit">
              <span className="material-symbols-outlined text-[15px] material-symbols-filled">
                bolt
              </span>
              بوست ۳X
            </span>
            <span className="font-outfit text-white font-extrabold text-sm mt-0.5">
              +۱,۴۵۰ XP
            </span>
          </div>
        </div>

        {/* Progress Track Bar */}
        <div className="w-full bg-[#181f2f] h-2 rounded-full mt-4 overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-l from-emerald-400 via-cyan-400 to-indigo-500 h-full rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </section>

      {/* 2. Interactive Quick Add Bar */}
      <section>
        <form
          onSubmit={handleQuickSubmit}
          className="flex items-center gap-2 bg-[#121724] border border-white/10 rounded-2xl p-2 sm:p-2.5 focus-within:border-cyan-400/60 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all"
        >
          <span className="material-symbols-outlined text-slate-400 text-[22px] mr-1 shrink-0">
            add_circle
          </span>
          <input
            type="text"
            value={quickInput}
            onChange={e => setQuickInput(e.target.value)}
            placeholder="افزودن کار و ماموریت جدید..."
            className="w-full bg-transparent border-0 text-white placeholder-slate-500 text-sm focus:ring-0 focus:outline-none px-1"
          />

          {/* Color priority selector dots */}
          <div className="flex items-center gap-2 shrink-0 bg-[#0c101a] px-2.5 py-1.5 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setActivePriority('critical')}
              aria-label="قرمز/نارنجی نئونی - بحرانی"
              className={`w-3.5 h-3.5 rounded-full bg-rose-500 transition-transform cursor-pointer ${
                activePriority === 'critical' ? 'ring-2 ring-rose-400 scale-110' : 'opacity-70'
              }`}
              title="ماموریت کلیدی"
            />
            <button
              type="button"
              onClick={() => setActivePriority('tech')}
              aria-label="فیروزه‌ای نئونی - فنی"
              className={`w-3.5 h-3.5 rounded-full bg-cyan-400 transition-transform cursor-pointer ${
                activePriority === 'tech' ? 'ring-2 ring-cyan-300 scale-110' : 'opacity-70'
              }`}
              title="پروژه و توسعه"
            />
            <button
              type="button"
              onClick={() => setActivePriority('growth')}
              aria-label="بنفش - رشد"
              className={`w-3.5 h-3.5 rounded-full bg-purple-400 transition-transform cursor-pointer ${
                activePriority === 'growth' ? 'ring-2 ring-purple-400 scale-110' : 'opacity-70'
              }`}
              title="رشد فردی"
            />
            <button
              type="button"
              onClick={() => setActivePriority('health')}
              aria-label="زمردی - سلامتی"
              className={`w-3.5 h-3.5 rounded-full bg-emerald-400 transition-transform cursor-pointer ${
                activePriority === 'health' ? 'ring-2 ring-emerald-400 scale-110' : 'opacity-70'
              }`}
              title="توازن زیستی"
            />
          </div>

          <span className="font-outfit text-xs text-cyan-300 font-bold px-2 py-1 rounded-lg bg-cyan-950/70 shrink-0 border border-cyan-800/40 hidden sm:inline-block">
            {priorityConfigs[activePriority]?.xpPreset || '+۱۵۰ XP'}
          </span>

          <button
            type="submit"
            aria-label="افزودن تسک"
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-cyan-300 text-[#00373a] flex items-center justify-center font-bold shadow-[0_0_15px_rgba(6,182,212,0.45)] hover:brightness-110 active:scale-90 transition-all shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">add</span>
          </button>
        </form>
      </section>

      {/* 3. Search, Filter & Advanced Controls */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-500 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="جستجو در تسک‌ها و یادداشت‌ها..."
            className="w-full pl-3 pr-9 py-2 rounded-xl bg-[#121724] border border-white/5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-2.5 text-slate-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Status toggles */}
        <div className="flex items-center gap-1 bg-[#10141f] p-1 rounded-xl border border-white/5 shrink-0 self-start sm:self-auto">
          {(['all', 'active', 'completed'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setStatusFilter(mode)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                statusFilter === mode
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode === 'all' ? 'همه' : mode === 'active' ? 'در جریان' : 'انجام‌شده'}
            </button>
          ))}
        </div>

        {/* Create Task Button */}
        <button
          onClick={() => onOpenTaskModal()}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">post_add</span>
          ماموریت پیشرفته
        </button>
      </section>

      {/* 4. Categorized Sections */}
      <div className="flex flex-col gap-6">
        {renderTaskSection('critical', criticalTasks, 'bg-rose-500')}
        {renderTaskSection('tech', techTasks, 'bg-cyan-400')}
        {renderTaskSection('growth', growthTasks, 'bg-purple-400')}
        {renderTaskSection('health', healthTasks, 'bg-emerald-400')}
      </div>

      {/* 5. Weekly Reward Chest Card (matching Image 3 & 1) */}
      <section className="flex flex-col rounded-2xl bg-gradient-to-r from-[#121622] via-[#1a172c] to-[#121622] p-5 shadow-2xl relative overflow-hidden border border-purple-500/20">
        <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 z-10">
          <div className="relative w-18 h-18 shrink-0 rounded-2xl bg-[#0e0c1a] border border-purple-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(208,188,255,0.2)] overflow-hidden p-1">
            <img
              alt="Treasure chest"
              className="w-16 h-16 object-cover rounded-xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMtJi0h98RlA7RKC-QYXcnSgJz9KuIK_BzIP1Zn8Sb9RFhCfEuAYbzpEH_9gli6IC-WtOegQvCXdMCuVVr3dQtrzn2_VoeywDQCZD5lYuonkLooAvRA1nMc-5wDSPUC5oYZkQWl_HfshMUukuvVcOgba-fq2NiZyGwmfELS0pGrvMNWyl-_T3kW0lp1krOD4aclIaknYia0cDTdyWPmETRFbunANtLi8V6yYqnEs8vxDHi0E4AFpPU"
            />
          </div>
          <div className="flex flex-col min-w-0 flex-1 gap-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs">🎁</span>
              <span className="text-xs font-bold text-purple-300 font-outfit">
                صندوقچه پاداش هفتگی
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white font-semibold leading-snug">
              فقط ۳ ماموریت تا بازگشایی نشان{' '}
              <span className="text-cyan-300 font-bold">«کاوشگر افسانه‌ای»</span>!
            </p>
            <div className="w-full bg-[#0a0e17] h-2 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-gradient-to-l from-cyan-400 to-purple-500 h-full rounded-full w-4/5 shadow-[0_0_8px_rgba(0,242,254,0.6)]" />
            </div>
          </div>
        </div>

        <button
          onClick={onOpenRewardChest}
          className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 text-[#00373a] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,242,254,0.35)] active:scale-95 transition-all cursor-pointer font-outfit"
        >
          <span className="material-symbols-outlined text-[20px]">military_tech</span>
          مشاهده پاداش‌ها و تالار افتخارات
        </button>
      </section>
    </div>
  );
};
