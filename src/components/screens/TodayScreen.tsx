import React from 'react';
import { UserProfile, Task, Habit } from '../../types';
import { AnimatedFlame } from '../common/AnimatedFlame';

interface TodayScreenProps {
  user: UserProfile;
  tasks: Task[];
  habits: Habit[];
  onToggleTask: (id: string) => void;
  onToggleHabit: (id: string) => void;
  onOpenDeepFocus: (taskTitle?: string) => void;
  onOpenTaskModal: (task?: Task) => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  user,
  tasks,
  habits,
  onToggleTask,
  onToggleHabit,
  onOpenDeepFocus,
  onOpenTaskModal,
}) => {
  // Today's epic quests
  const epicTasks = tasks.filter(t => t.isEpic || !t.completed).slice(0, 4);
  const remainingCount = epicTasks.filter(t => !t.completed).length;

  const xpPercent = Math.min(100, Math.round((user.currentXp / user.nextLevelXp) * 100));

  // Today habits status
  const todayStr = new Date().toISOString().split('T')[0];
  const completedHabitsCount = habits.filter(h => !!h.history[todayStr]).length;

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 py-5 gap-6 max-w-4xl mx-auto">
      {/* 1. Minimal Hero Greeting Section */}
      <section className="relative overflow-hidden rounded-3xl bg-surface-container-high/60 backdrop-blur-xl p-5 sm:p-6 border border-white/5 shadow-md">
        {/* Glow ambient lights */}
        <div className="absolute -top-10 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-6 left-1/4 w-44 h-44 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Level badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a0e17]/80 border border-white/5 shadow-sm">
            <span className="material-symbols-outlined text-cyan-400 text-[16px] material-symbols-filled">
              military_tech
            </span>
            <span className="text-xs text-white font-medium tracking-wide">
              سطح {user.level} • {user.roleTitle}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f2fe]" />
          </div>

          <h1 className="mt-3 text-xl sm:text-2xl font-bold text-white tracking-tight">
            سلام {user.name} عزیز! امروز پرانرژی هستی 🚀
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 font-normal leading-relaxed">
            {remainingCount > 0
              ? `${remainingCount} ماموریت برای تسخیر روز و رکوردشکنی پیش‌رو داری!`
              : 'تمامی ماموریت‌های حماسی امروز با موفقیت فتح شدند!'}
          </p>

          {/* XP Progress Card */}
          <div className="w-full mt-5 p-4 rounded-2xl bg-[#0a0e17]/70 backdrop-blur-md border border-white/5">
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-1 text-cyan-300 font-semibold">
                <span className="material-symbols-outlined text-[16px] material-symbols-filled">
                  bolt
                </span>
                <span>پیشرفت XP امروز</span>
              </div>
              <div className="text-white font-bold font-outfit text-sm">
                <span>{user.currentXp.toLocaleString('fa-IR')}</span>
                <span className="text-slate-400 font-normal text-xs">
                  {' '}
                  / {user.nextLevelXp.toLocaleString('fa-IR')}
                </span>
                <span className="text-cyan-400 text-xs mr-1 font-semibold">({xpPercent}٪)</span>
              </div>
            </div>

            <div className="relative w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 shadow-[0_0_12px_#00f2fe] transition-all duration-1000 ease-out"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sleek Streak & Habits Bar */}
      <section className="w-full rounded-3xl bg-[#121622]/80 p-5 border border-white/5 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AnimatedFlame className="w-7 h-7" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white flex items-center gap-1">
                {user.streakDays} روز پیاپی آتشین 🔥
              </span>
              <span className="text-[11px] text-slate-400">
                {completedHabitsCount} از {habits.length} عادت امروز ثبت شدند!
              </span>
            </div>
          </div>
        </div>

        {/* 4 Habit Tiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {habits.slice(0, 4).map(habit => {
            const isDone = !!habit.history[todayStr];
            return (
              <button
                key={habit.id}
                onClick={() => onToggleHabit(habit.id)}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all active:scale-95 cursor-pointer text-right ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-purple-950/20 border-purple-500/25 text-purple-200 hover:bg-purple-950/35'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[17px] text-slate-300">
                    {habit.icon || 'star'}
                  </span>
                  <span className="text-xs font-medium truncate">{habit.title}</span>
                </div>
                <span
                  className={`material-symbols-outlined text-[18px] shrink-0 ${
                    isDone
                      ? 'text-emerald-400 material-symbols-filled'
                      : 'text-purple-400'
                  }`}
                >
                  {isDone ? 'check_circle' : 'hourglass_top'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Minimalist Deep Focus Control */}
      <section className="relative w-full rounded-2xl bg-gradient-to-r from-[#141b2a] via-[#101726] to-[#141b2a] p-4 sm:p-5 border border-cyan-500/20 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(0,242,254,0.3)] shrink-0">
            <span className="material-symbols-outlined text-[24px]">graphic_eq</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-outfit text-sm sm:text-base font-bold text-white truncate">
              حالت تمرکز فضایی (Deep Focus)
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 truncate">
              اسپرینت ۲۵ دقیقه‌ای • امواج آلفا نئونی 🎧
            </span>
          </div>
        </div>

        <button
          onClick={() => onOpenDeepFocus()}
          aria-label="شروع اسپرینت تمرکز"
          className="shrink-0 w-11 h-11 rounded-full bg-cyan-400 text-[#00373a] flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px] material-symbols-filled">
            play_arrow
          </span>
        </button>
      </section>

      {/* 4. Quests & Tasks: Light, airy, spacious list */}
      <section className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-400 text-[22px]">
              flag_circle
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">
              ماموریت‌های حماسی امروز
            </h2>
          </div>
          <span className="text-xs text-cyan-300 font-outfit bg-cyan-950/70 border border-cyan-800/40 px-2.5 py-0.5 rounded-full">
            {remainingCount} باقیمانده
          </span>
        </div>

        {/* Tasks list */}
        <div className="flex flex-col gap-3">
          {epicTasks.map(task => {
            return (
              <div
                key={task.id}
                className={`group relative w-full rounded-2xl bg-[#10141f] border p-4 transition-all duration-200 hover:border-white/20 shadow-md ${
                  task.completed
                    ? 'border-white/5 opacity-60'
                    : 'border-white/10 hover:bg-[#131826]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Checkbox */}
                    <button
                      onClick={() => onToggleTask(task.id)}
                      aria-label="تکمیل ماموریت"
                      className={`mt-0.5 shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        task.completed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400'
                          : 'bg-white/5 border border-white/20 text-slate-400 hover:border-cyan-400'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[17px] ${
                          task.completed ? 'opacity-100' : 'opacity-0 hover:opacity-50'
                        }`}
                      >
                        done
                      </span>
                    </button>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-xs font-semibold text-cyan-300 border border-white/5">
                          {task.priorityLabel}
                        </span>
                        <span className="text-slate-400 text-xs flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[13px]">schedule</span>
                          {task.timeLabel}
                        </span>
                      </div>

                      <h3
                        onClick={() => onOpenTaskModal(task)}
                        className={`text-sm font-semibold cursor-pointer transition-all ${
                          task.completed
                            ? 'text-slate-400 line-through'
                            : 'text-white hover:text-cyan-300'
                        }`}
                      >
                        {task.title}
                      </h3>

                      {task.contextNote && (
                        <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                          {task.contextNote}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="shrink-0 px-2.5 py-1 rounded-xl bg-white/[0.03] text-cyan-300 border border-white/5 font-outfit text-xs font-bold shadow-sm">
                    +{task.xp} XP
                  </span>
                </div>

                {/* Sub-bar with avatars / sprint action */}
                <div className="mt-3 pt-2.5 flex items-center justify-between border-t border-white/5">
                  <div className="flex items-center gap-2">
                    {task.category === 'critical' ? (
                      <div className="flex -space-x-2 space-x-reverse overflow-hidden">
                        <img
                          alt="Team avatar 1"
                          className="inline-block h-6 w-6 rounded-full object-cover ring-1 ring-[#0a0e17]"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCumpU3rg2XjOs4s9v3HuF0oQCCOdLkyTVREWTbwJzWJ-K2d0MryZN1m7t2dDf2zIHuYUcqV_Z0l3SpmET-GCjSNXOgB6kDWhSwGjbQcr2yI59WkuBWqEJIYfHvnScdF7E-ULaFQekt48GbXCLitC_w3QetUNcBwrZ7a47sRcF-gYSB3yM6siQt2ySYpsldKbl3SnQ0tIqH7a2_L_VV_xkwFBpRJTfBVAB8cilKRY5kb8Loq8gSejBX"
                        />
                        <img
                          alt="Team avatar 2"
                          className="inline-block h-6 w-6 rounded-full object-cover ring-1 ring-[#0a0e17]"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqZ1nefjPWjJ6892sUQZeW058uvtzbX6ujkyHaoYr3UPd1GC22IUP3mCrYDIE-IcEwqIHlajv9cBohiBExS9bxOZBLHohrYoiqQA2GVoPEVYGSBUxKY7og6tn-wkR7hapEYXh71psBfifHe8gnu_1VpUHivhsfksr5fT1jJYRphSbcKff5Xi4BZ8qWnprBO8P_u9Ib35WnqbPtifskJMsREs7qV-bYeXJ1l7KAVXNVJ6oZuqq9P-30"
                        />
                      </div>
                    ) : task.category === 'health' ? (
                      <span className="text-[11px] text-slate-400">باشگاه مگا فیتنس • ۵۰۰ کالری</span>
                    ) : (
                      <span className="text-[11px] text-slate-400">کتاب مرجع DevOps ۲۰۲۴</span>
                    )}
                  </div>

                  {!task.completed && (
                    <button
                      onClick={() => onOpenDeepFocus(task.title)}
                      className="px-3 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-cyan-300 font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-white/5"
                    >
                      <span className="material-symbols-outlined text-[15px]">play_circle</span>
                      <span>آغاز اسپرینت</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Minimal Calm Quote */}
      <div className="py-2 text-center">
        <p className="text-xs text-slate-400 italic leading-relaxed">
          «نظم شخصی پلی است میان رویاهای بزرگ و دستاوردهای واقعی.»
        </p>
        <span className="text-[11px] text-slate-500 mt-1 block">
          کاپیتان {user.name} • پیروزی امروز در دستان توست!
        </span>
      </div>
    </div>
  );
};
