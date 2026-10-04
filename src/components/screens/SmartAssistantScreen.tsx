import React, { useState } from 'react';
import { UserProfile, Task, TaskCategory } from '../../types';
import { AnimatedOrbit } from '../common/AnimatedOrbit';

interface SmartAssistantScreenProps {
  user: UserProfile;
  tasks: Task[];
  onAddGeneratedTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  onOpenDeepFocus: (title?: string) => void;
}

export const SmartAssistantScreen: React.FC<SmartAssistantScreenProps> = ({
  user,
  tasks,
  onAddGeneratedTask,
  onOpenDeepFocus,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSteps, setGeneratedSteps] = useState<
    { title: string; category: TaskCategory; xp: number; time: string; note: string }[]
  >([]);
  const [addedIndexes, setAddedIndexes] = useState<{ [index: number]: boolean }>({});

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  const handleBreakdown = (customPrompt?: string) => {
    const query = customPrompt || promptInput.trim();
    if (!query) return;

    setIsGenerating(true);
    setAddedIndexes({});

    // Intelligent breakdown generation
    setTimeout(() => {
      let steps: { title: string; category: TaskCategory; xp: number; time: string; note: string }[] = [];

      if (query.includes('کوبرنتیز') || query.includes('فنی') || query.includes('کد') || query.includes('معماری') || query.includes('سرور')) {
        steps = [
          {
            title: `طراحی دیاگرام معماری سرویس برای «${query}»`,
            category: 'tech',
            xp: 150,
            time: 'امروز ۱۰:۰۰ صبح',
            note: 'تعریف اندپوینت‌ها و اینترفیس‌های کلیدی',
          },
          {
            title: `پیاده‌سازی کدهای پایه و تست واحد هسته سرویس`,
            category: 'tech',
            xp: 200,
            time: 'امروز ۱۴:۰۰ بعدازظهر',
            note: 'پوشش بالای ۸۰٪ تست‌های کلیدی',
          },
          {
            title: `داکرایز کردن و نوشتن مانیفست‌های استقرار ابری`,
            category: 'critical',
            xp: 180,
            time: 'فردا ۱۰:۰۰ صبح',
            note: 'بررسی محدودیت‌های منابع رم و پردازنده',
          },
        ];
      } else if (query.includes('ورزش') || query.includes('سلامت') || query.includes('بدنسازی')) {
        steps = [
          {
            title: `گرم‌کردن پویا و ۱۰ دقیقه تمرینات موبیلیتی مفاصل`,
            category: 'health',
            xp: 60,
            time: 'ساعت ۱۷:۳۰',
            note: 'پیشگیری از آسیب و آماده‌سازی ضربان قلب',
          },
          {
            title: `اجرای سوپرست‌های تمرین قدرتی با تمرکز بر فرم صحیح`,
            category: 'health',
            xp: 100,
            time: 'ساعت ۱۸:۰۰',
            note: 'ثبت وزنه‌ها در اپلیکیشن سلامت',
          },
          {
            title: `سرد کردن، کشش ایستا و مصرف پروتئین ریکاوری`,
            category: 'health',
            xp: 50,
            time: 'ساعت ۱۹:۰۰',
            note: 'نوشیدن نیم لیتر آب الکترولیت',
          },
        ];
      } else {
        steps = [
          {
            title: `شفاف‌سازی اهداف و نیازمندی‌های کلیدی: ${query}`,
            category: 'growth',
            xp: 100,
            time: 'امروز ۱۱:۰۰ صبح',
            note: 'مشخص کردن خروجی نهایی قابل اندازه‌گیری',
          },
          {
            title: `اسپرینت تمرکز عمیق ۲۵ دقیقه‌ای برای اجرای فاز اول`,
            category: 'critical',
            xp: 150,
            time: 'امروز ۱۵:۰۰',
            note: 'مسدودسازی تمام اعلان‌ها و حواس‌پرتی‌ها',
          },
          {
            title: `بازبینی نهایی، یادداشت‌برداری و جشن دستاورد`,
            category: 'growth',
            xp: 80,
            time: 'امروز ۱۹:۰۰',
            note: 'بررسی کیفیت و ثبت تجربه در LifeOS',
          },
        ];
      }

      setGeneratedSteps(steps);
      setIsGenerating(false);
    }, 600);
  };

  const handleAddStepToTasks = (
    step: { title: string; category: TaskCategory; xp: number; time: string; note: string },
    index: number
  ) => {
    onAddGeneratedTask({
      title: step.title,
      category: step.category,
      priorityLabel: step.category === 'critical' ? 'اولویت بحرانی 🔥' : 'پیشنهاد هوشمند 🤖',
      timeLabel: step.time,
      contextNote: step.note,
      xp: step.xp,
      isEpic: true,
    });
    setAddedIndexes(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 py-5 gap-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#121724] to-[#0a0e17] p-5 border border-cyan-500/20 shadow-xl">
        <div className="flex items-center gap-3">
          <AnimatedOrbit className="w-12 h-12" />
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-white tracking-tight">
              دستیار هوشمند و تحلیلگر عملکرد LifeOS
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              مدل‌سازی روزانه، تجزیه پروژه‌ها به ماموریت‌های کوچک و پیشنهادات ریتم انرژی
            </p>
          </div>
        </div>
      </section>

      {/* Daily Performance Briefing */}
      <section className="p-5 rounded-2xl bg-[#121724] border border-white/5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">insights</span>
            تحلیل ریتم و سرعت امروز ({user.name})
          </span>
          <span className="text-[11px] font-outfit text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20 font-bold">
            بوست {user.boostMultiplier}X فعال
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          شما تاکنون <strong className="text-white font-bold">{completedCount} ماموریت</strong> را با موفقیت پشت سر گذاشته‌اید و <strong className="text-cyan-300 font-bold">{pendingCount} کار دیگر</strong> برای فتح اهداف روزانه دارید. بهترین پنجره برای تمرکز عمیق شما هم‌اکنون است!
        </p>

        <div className="flex items-center gap-3 pt-2 border-t border-white/5">
          <button
            onClick={() => onOpenDeepFocus()}
            className="px-4 py-2 rounded-xl bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 text-xs font-bold flex items-center gap-2 hover:bg-cyan-400/25 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">play_arrow</span>
            ورود به اسپرینت تمرکز پیشنهادی
          </button>
        </div>
      </section>

      {/* AI Project Breakdown Generator */}
      <section className="p-5 rounded-2xl bg-[#121724] border border-white/5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-400 text-[20px]">
            account_tree
          </span>
          <h2 className="text-sm font-bold text-white">
            تجزیه هوشمند پروژه‌ها به گام‌های عملیاتی
          </h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed -mt-2">
          هر ایده یا پروژه پیچیده را بنویسید تا سیستم آن را به ماموریت‌های استاندارد با برچسب اولویت و امتیاز XP تبدیل کند.
        </p>

        {/* Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={promptInput}
            onChange={e => setPromptInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleBreakdown()}
            placeholder="مثال: پیاده‌سازی کلاستر توزیع‌شده با Go و Envoy..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={() => handleBreakdown()}
            disabled={isGenerating}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[17px]">
              {isGenerating ? 'hourglass_empty' : 'auto_fix_high'}
            </span>
            <span>{isGenerating ? 'تحلیل...' : 'تجزیه هوشمند'}</span>
          </button>
        </div>

        {/* Quick prompt suggestions */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400">
          <span>نمونه‌ها:</span>
          {[
            'پیاده‌سازی پایگاه‌داده و رپلیکیشن',
            'برنامه سفر آخر هفته به شمال',
            'روتین تمرینی تناسب اندام',
          ].map(sample => (
            <button
              key={sample}
              onClick={() => {
                setPromptInput(sample);
                handleBreakdown(sample);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer border border-white/5"
            >
              {sample}
            </button>
          ))}
        </div>

        {/* Results */}
        {generatedSteps.length > 0 && (
          <div className="flex flex-col gap-2.5 mt-2 pt-3 border-t border-white/5">
            <span className="text-xs font-semibold text-slate-300">ماموریت‌های تولیدشده:</span>
            {generatedSteps.map((step, idx) => {
              const isAdded = !!addedIndexes[idx];
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-3 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-bold text-white truncate">{step.title}</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 truncate">{step.note}</span>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                      <span>{step.time}</span>
                      <span>•</span>
                      <span className="text-cyan-400 font-outfit font-bold">+{step.xp} XP</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddStepToTasks(step, idx)}
                    disabled={isAdded}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                        : 'bg-white/10 hover:bg-cyan-500/20 text-white hover:text-cyan-300 border border-white/10'
                    }`}
                  >
                    {isAdded ? 'افزوده شد ✓' : '+ افزودن به کارها'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
