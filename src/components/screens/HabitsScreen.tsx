import React, { useState } from 'react';
import { Habit, TaskCategory } from '../../types';
import { AnimatedFlame } from '../common/AnimatedFlame';

interface HabitsScreenProps {
  habits: Habit[];
  onToggleHabit: (id: string, dateKey?: string) => void;
  onCreateHabit: (habit: Omit<Habit, 'id' | 'currentStreak' | 'history'>) => void;
  onDeleteHabit: (id: string) => void;
}

export const HabitsScreen: React.FC<HabitsScreenProps> = ({
  habits,
  onToggleHabit,
  onCreateHabit,
  onDeleteHabit,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('health');
  const [newIcon, setNewIcon] = useState('favorite');

  // Days of current week in Persian (Saturday to Friday)
  const getPersianWeekDays = () => {
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday
    // Persian week starts on Saturday (which is JS index 6)
    const diffToSaturday = (currentDayOfWeek + 1) % 7;
    const saturday = new Date(today);
    saturday.setDate(today.getDate() - diffToSaturday);

    const days = [
      { name: 'ش', label: 'شنبه' },
      { name: 'ی', label: 'یکشنبه' },
      { name: 'د', label: 'دوشنبه' },
      { name: 'س', label: 'سه‌شنبه' },
      { name: 'چ', label: 'چهارشنبه' },
      { name: 'پ', label: 'پنج‌شنبه' },
      { name: 'ج', label: 'جمعه' },
    ];

    return days.map((day, index) => {
      const d = new Date(saturday);
      d.setDate(saturday.getDate() + index);
      const dateKey = d.toISOString().split('T')[0];
      const isToday = dateKey === today.toISOString().split('T')[0];
      return {
        ...day,
        dateKey,
        isToday,
      };
    });
  };

  const weekDays = getPersianWeekDays();

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onCreateHabit({
      title: newTitle.trim(),
      category: newCategory,
      icon: newIcon,
      targetCount: 7,
      color: newCategory === 'health' ? '#10b981' : '#a855f7',
    });

    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 py-5 gap-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#121724] to-[#0a0e17] p-5 border border-white/5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AnimatedFlame className="w-10 h-10" />
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-white tracking-tight">
                ماتریس عادات و سبک زندگی
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                توسعه زنجیره استمرار و توازن در ۴ حوزه کلیدی زندگی
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-2 rounded-xl bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            عادت جدید
          </button>
        </div>
      </section>

      {/* Weekly Habit Matrix Table */}
      <section className="rounded-2xl bg-[#121724] border border-white/5 p-4 sm:p-5 shadow-lg overflow-x-auto">
        <div className="min-w-[480px]">
          {/* Table Header: Days of the week */}
          <div className="flex items-center pb-3 border-b border-white/5 text-xs text-slate-400">
            <span className="w-44 text-right font-medium">عادت‌های فعال</span>
            <div className="flex-1 flex justify-around items-center">
              {weekDays.map(day => (
                <div
                  key={day.name}
                  className={`flex flex-col items-center justify-center w-8 h-8 rounded-lg ${
                    day.isToday ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold' : ''
                  }`}
                >
                  <span className="text-[12px]">{day.name}</span>
                </div>
              ))}
            </div>
            <span className="w-16 text-center">زنجیره</span>
          </div>

          {/* Habit Rows */}
          <div className="flex flex-col divide-y divide-white/5 mt-2">
            {habits.map(habit => {
              return (
                <div key={habit.id} className="flex items-center py-3.5 hover:bg-white/[0.01] transition-all">
                  {/* Habit info */}
                  <div className="w-44 flex items-center gap-2.5 min-w-0 pr-1">
                    <span className="material-symbols-outlined text-[18px] text-cyan-400 shrink-0">
                      {habit.icon || 'star'}
                    </span>
                    <span className="text-xs font-semibold text-white truncate">
                      {habit.title}
                    </span>
                  </div>

                  {/* 7 Day check dots */}
                  <div className="flex-1 flex justify-around items-center">
                    {weekDays.map(day => {
                      const isCompleted = !!habit.history[day.dateKey];
                      return (
                        <button
                          key={day.dateKey}
                          onClick={() => onToggleHabit(habit.id, day.dateKey)}
                          title={`${habit.title} در ${day.label}`}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                            isCompleted
                              ? 'bg-emerald-500/20 border border-emerald-400/80 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                              : 'bg-white/5 border border-white/10 hover:border-white/30 text-slate-600'
                          }`}
                        >
                          <span className={`material-symbols-outlined text-[15px] ${isCompleted ? 'opacity-100' : 'opacity-0'}`}>
                            check
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Streak count */}
                  <div className="w-16 flex items-center justify-center gap-1 font-outfit text-xs font-bold text-amber-400">
                    <span>{habit.currentStreak}</span>
                    <span className="text-[10px]">🔥</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Life Areas Balance */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-[#121724] border border-white/5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">توازن حوزه‌های زندگی</span>
            <span className="text-[11px] text-cyan-300 font-outfit">شاخص تعادل: ۸۶٪</span>
          </div>
          <div className="flex flex-col gap-2 mt-1">
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>توسعه فنی و مهندسی</span>
                <span className="font-outfit text-cyan-300">۹۰٪</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full w-[90%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>تندرستی و فیتنس</span>
                <span className="font-outfit text-emerald-400">۸۵٪</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full w-[85%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>رشد ذهنی و مطالعه</span>
                <span className="font-outfit text-purple-400">۷۵٪</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full w-[75%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-[#121724] border border-cyan-500/20 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              استمرار رکوردشکن هفتگی
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              با حفظ ۴ عادت روزانه در طول هفته جاری، بوست ۳X برای تمام ماموریت‌های پیش‌رو فعال باقی می‌ماند.
            </p>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/5">
            <span>مجموع دفعات ثبت این ماه:</span>
            <span className="font-outfit font-bold text-white text-sm">۴۸ بار</span>
          </div>
        </div>
      </section>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <div className="w-full max-w-md rounded-3xl bg-[#0f1422] border border-white/10 p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-white">افزودن عادت روزانه جدید</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">نام عادت</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="مثال: ۱۰ دقیقه پیاده‌روی..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">دسته‌بندی</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as TaskCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141b2a] border border-white/10 text-xs text-white focus:outline-none"
                >
                  <option value="health">سلامتی و توازن زیستی</option>
                  <option value="growth">رشد فردی و یادگیری</option>
                  <option value="tech">پروژه و توسعه فنی</option>
                  <option value="critical">ماموریت کلیدی</option>
                </select>
              </div>

              <button
                type="submit"
                className="mt-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-[#00373a] font-bold text-xs"
              >
                ایجاد و شروع استمرار
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
