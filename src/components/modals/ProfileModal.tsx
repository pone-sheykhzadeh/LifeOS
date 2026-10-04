import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { storageService } from '../../services/storageService';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onDataReset: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onDataReset,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [roleTitle, setRoleTitle] = useState(user.roleTitle);
  const [importJson, setImportJson] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...user,
      name: name.trim() || user.name,
      roleTitle: roleTitle.trim() || user.roleTitle,
    };
    storageService.saveUser(updated);
    onUpdateUser(updated);
    setIsEditing(false);
    setStatusMessage('پروفایل با موفقیت به‌روزرسانی شد');
    setTimeout(() => setStatusMessage(''), 2500);
  };

  const handleExport = () => {
    const backup = storageService.exportBackup();
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeos-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage('فایل پشتیبان با فرمت JSON دانلود شد');
    setTimeout(() => setStatusMessage(''), 2500);
  };

  const handleImport = () => {
    if (!importJson.trim()) return;
    const success = storageService.importBackup(importJson);
    if (success) {
      setStatusMessage('اطلاعات با موفقیت بازیابی شد');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setStatusMessage('خطا در خواندن فایل JSON');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0f1422] border border-white/10 p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow */}
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400 text-[22px]">account_circle</span>
            <h2 className="font-outfit text-base font-bold text-white">نمایه کاربری و مالکیت داده‌ها</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-4">
          {/* User badge */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <img
              alt={user.name}
              src={user.avatarUrl}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-cyan-400/50"
            />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-base font-bold text-white truncate">{user.name}</span>
              <span className="text-xs text-cyan-300 font-medium">{user.roleTitle}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 font-outfit">
                  سطح {user.level}
                </span>
                <span className="text-[10px] text-slate-400 font-outfit">
                  {user.currentXp} / {user.nextLevelXp} XP
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-all cursor-pointer"
            >
              {isEditing ? 'انصراف' : 'ویرایش'}
            </button>
          </div>

          {/* Edit form */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-400">نام کاربری</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-400">عنوان و مقام</label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={e => setRoleTitle(e.target.value)}
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <button
                type="submit"
                className="py-2 rounded-lg bg-cyan-400 text-[#00373a] font-bold text-xs hover:brightness-110 cursor-pointer"
              >
                ذخیره نمایه
              </button>
            </form>
          )}

          {/* Stats overview */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <span className="text-xs text-slate-400 block">زنجیره پیوسته</span>
              <span className="font-outfit text-base font-bold text-amber-400 mt-1 block">
                {user.streakDays} روز 🔥
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <span className="text-xs text-slate-400 block">تمرکز عمیق</span>
              <span className="font-outfit text-base font-bold text-cyan-300 mt-1 block">
                {user.focusMinutesTotal} دقیقه
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <span className="text-xs text-slate-400 block">بوست امتیاز</span>
              <span className="font-outfit text-base font-bold text-emerald-400 mt-1 block">
                {user.boostMultiplier}X فعال
              </span>
            </div>
          </div>

          {/* Data Ownership & Supabase / Independent Deployment info */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-400 text-[18px]">database</span>
              <span className="text-xs font-semibold text-white">مالکیت داده‌ها و دیتابیس مستقل</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              تمام اطلاعات، ماموریت‌ها و تاریخچه شما به صورت محلی و استاندارد ذخیره می‌شود و معماری آن آماده اتصال به Supabase یا سرویس‌های ابری است.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={handleExport}
                className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200 border border-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                خروجی JSON
              </button>
              <button
                onClick={() => setShowImportArea(!showImportArea)}
                className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200 border border-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">upload</span>
                بازیابی JSON
              </button>
            </div>
          </div>

          {/* Import Textarea */}
          {showImportArea && (
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <textarea
                rows={3}
                value={importJson}
                onChange={e => setImportJson(e.target.value)}
                placeholder="متن پشتیبان JSON را اینجا الصاق نمایید..."
                className="w-full text-[11px] font-mono p-2 rounded-lg bg-black/40 border border-white/10 text-slate-300 focus:outline-none"
              />
              <button
                onClick={handleImport}
                className="py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/30 cursor-pointer"
              >
                تایید و وارد کردن
              </button>
            </div>
          )}

          {/* Reset button */}
          <button
            onClick={() => {
              if (confirm('آیا مایل به بازنشانی داده‌ها به وضعیت پیش‌فرض اولیه هستید؟')) {
                storageService.resetAll();
                onDataReset();
                onClose();
              }
            }}
            className="text-[11px] text-slate-500 hover:text-rose-400 text-center py-1 transition-colors cursor-pointer"
          >
            بازنشانی داده‌ها به حالت اولیه (نمونه دیزاین LifeOS)
          </button>

          {statusMessage && (
            <div className="p-2 text-center text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded-lg">
              {statusMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
