import React, { useState, useEffect } from 'react';
import { Task, TaskCategory } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('cyan' as unknown as TaskCategory);
  const [xp, setXp] = useState(150);
  const [timeLabel, setTimeLabel] = useState('امروز ساعت ۱۶:۰۰');
  const [contextNote, setContextNote] = useState('');
  const [isEpic, setIsEpic] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number | undefined>(undefined);
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setCategory(taskToEdit.category);
      setXp(taskToEdit.xp);
      setTimeLabel(taskToEdit.timeLabel);
      setContextNote(taskToEdit.contextNote || '');
      setIsEpic(!!taskToEdit.isEpic);
      setProgressPercent(taskToEdit.progressPercent);
    } else {
      setTitle('');
      setCategory('tech');
      setXp(150);
      setTimeLabel('امروز ساعت ۱۶:۰۰');
      setContextNote('');
      setIsEpic(false);
      setProgressPercent(undefined);
    }
    setError('');
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('لطفاً عنوان ماموریت را وارد کنید');
      return;
    }

    const priorityLabelMap: Record<TaskCategory, string> = {
      critical: 'اولویت بحرانی 🔥',
      tech: 'توسعه فنی ⚡',
      growth: 'رشد فردی 🔮',
      health: 'توازن زیستی 🌿',
    };

    onSave({
      id: taskToEdit?.id,
      title: title.trim(),
      category,
      priorityLabel: priorityLabelMap[category] || 'عادی',
      timeLabel: timeLabel.trim() || 'امروز',
      contextNote: contextNote.trim() || undefined,
      xp: Number(xp) || 100,
      isEpic,
      progressPercent: category === 'tech' ? progressPercent : undefined,
    });

    onClose();
  };

  const categories: { id: TaskCategory; label: string; color: string; ring: string }[] = [
    { id: 'critical', label: 'فوری و بحرانی', color: 'bg-rose-500', ring: 'ring-rose-400' },
    { id: 'tech', label: 'پروژه‌ها و فنی', color: 'bg-cyan-400', ring: 'ring-cyan-400' },
    { id: 'growth', label: 'رشد و یادگیری', color: 'bg-purple-400', ring: 'ring-purple-400' },
    { id: 'health', label: 'سلامتی و توازن', color: 'bg-emerald-400', ring: 'ring-emerald-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0f1422] border border-white/10 p-6 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400 text-[24px]">
              {taskToEdit ? 'edit_note' : 'add_task'}
            </span>
            <h2 className="font-outfit text-lg font-bold text-white">
              {taskToEdit ? 'ویرایش ماموریت' : 'ایجاد ماموریت جدید'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">عنوان ماموریت *</label>
            <input
              type="text"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="مثال: پیاده‌سازی سرویس احراز هویت..."
              className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
            />
            {error && <span className="text-xs text-rose-400">{error}</span>}
          </div>

          {/* Category Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">دسته‌بندی و اولویت</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => {
                const isSelected = category === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? `bg-white/[0.08] border-white/30 text-white shadow-sm ring-1 ${cat.ring}`
                        : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${cat.color} shrink-0`} />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* XP Reward & Due Time Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">امتیاز ماموریت (XP)</label>
              <div className="flex items-center gap-2">
                {[80, 100, 150, 200].map(val => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setXp(val)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-outfit font-bold transition-all cursor-pointer ${
                      xp === val
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">زمانبندی و مهلت</label>
              <input
                type="text"
                value={timeLabel}
                onChange={e => setTimeLabel(e.target.value)}
                placeholder="امروز ساعت ۱۵:۰۰"
                className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60"
              />
            </div>
          </div>

          {/* Context Note */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">توضیحات و نیازمندی‌ها (اختیاری)</label>
            <textarea
              rows={2}
              value={contextNote}
              onChange={e => setContextNote(e.target.value)}
              placeholder="مثال: نیازمند تمرکز عمیق، بررسی با مدیر محصول..."
              className="w-full rounded-xl bg-white/[0.03] border border-white/10 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 resize-none"
            />
          </div>

          {/* Options: Is Epic Quest & Tech Progress */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">ماموریت حماسی روزانه</span>
              <span className="text-[11px] text-slate-400">نمایش در داشبورد اصلی امروز</span>
            </div>
            <input
              type="checkbox"
              checked={isEpic}
              onChange={e => setIsEpic(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-0 cursor-pointer"
            />
          </div>

          {category === 'tech' && (
            <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">درصد پیشرفت فعلی</span>
                <span className="font-outfit text-cyan-300">{progressPercent || 0}٪</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercent || 0}
                onChange={e => setProgressPercent(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/5">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-[#00373a] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,242,254,0.35)] hover:brightness-110 active:scale-95 transition-all cursor-pointer font-outfit"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>{taskToEdit ? 'ذخیره تغییرات' : 'افزودن ماموریت'}</span>
            </button>

            {taskToEdit && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('آیا از حذف این ماموریت اطمینان دارید؟')) {
                    onDelete(taskToEdit.id);
                    onClose();
                  }
                }}
                className="px-4 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all cursor-pointer"
              >
                حذف
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
