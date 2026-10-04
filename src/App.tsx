import { useState, useEffect, useCallback } from 'react';
import { ActiveTab, Task, TaskCategory, Habit, UserProfile, Achievement, NotificationItem } from './types';
import { storageService } from './services/storageService';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Toast, ToastMessage } from './components/common/Toast';
import { TodayScreen } from './components/screens/TodayScreen';
import { TasksScreen } from './components/screens/TasksScreen';
import { HabitsScreen } from './components/screens/HabitsScreen';
import { SmartAssistantScreen } from './components/screens/SmartAssistantScreen';
import { DeepFocusModal } from './components/modals/DeepFocusModal';
import { RewardChestModal } from './components/modals/RewardChestModal';
import { TaskModal } from './components/modals/TaskModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { ProfileModal } from './components/modals/ProfileModal';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [user, setUser] = useState<UserProfile>(storageService.getUser());
  const [tasks, setTasks] = useState<Task[]>(storageService.getTasks());
  const [habits, setHabits] = useState<Habit[]>(storageService.getHabits());
  const [achievements, setAchievements] = useState<Achievement[]>(storageService.getAchievements());
  const [notifications, setNotifications] = useState<NotificationItem[]>(storageService.getNotifications());

  // Modals state
  const [isDeepFocusOpen, setIsDeepFocusOpen] = useState(false);
  const [isRewardChestOpen, setIsRewardChestOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback(
    (title: string, subtitle?: string, icon?: string, type?: 'success' | 'xp' | 'reward' | 'info') => {
      setToast({
        id: 'toast_' + Date.now(),
        title,
        subtitle,
        icon: icon || '⚡',
        type: type || 'success',
      });
    },
    []
  );

  // Sync state whenever refreshed
  const refreshAllData = useCallback(() => {
    setUser(storageService.getUser());
    setTasks(storageService.getTasks());
    setHabits(storageService.getHabits());
    setAchievements(storageService.getAchievements());
    setNotifications(storageService.getNotifications());
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Task Actions
  const handleToggleTask = (id: string) => {
    const { task, xpEarned } = storageService.toggleTask(id);
    if (!task) return;

    setTasks(storageService.getTasks());
    setUser(storageService.getUser());

    if (task.completed) {
      // Confetti burst on epic or major task
      if (task.xp >= 150) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#00f2fe', '#8b5cf6', '#10b981'],
        });
      }
      showToast(
        `ماموریت «${task.title}» انجام شد!`,
        `+${xpEarned} XP به نمایه شما اضافه گردید 🎉`,
        '⚡',
        'xp'
      );
    } else {
      showToast('ماموریت به وضعیت در جریان بازگشت', undefined, 'replay', 'info');
    }
  };

  const handleQuickAdd = (title: string, category: TaskCategory) => {
    const priorityLabels: Record<TaskCategory, { label: string; xp: number }> = {
      critical: { label: 'اولویت بحرانی 🔥', xp: 200 },
      tech: { label: 'Cyber Cyan ⚡', xp: 150 },
      growth: { label: 'Electric Violet 🔮', xp: 120 },
      health: { label: 'Emerald Glow 🌿', xp: 100 },
    };

    const config = priorityLabels[category] || { label: 'عادی', xp: 150 };

    storageService.createTask({
      title,
      category,
      priorityLabel: config.label,
      timeLabel: 'امروز',
      contextNote: 'اضافه شده از نوار سریع',
      xp: config.xp,
      isEpic: true,
    });

    setTasks(storageService.getTasks());
    showToast('ماموریت جدید با موفقیت اضافه شد ✨', `+${config.xp} XP ظرفیت کسب امتیاز`, 'check_circle', 'success');
  };

  const handleSaveTaskModal = (
    taskData: Omit<Task, 'id' | 'createdAt' | 'completed'> & { id?: string }
  ) => {
    if (taskData.id) {
      // Editing
      const existing = tasks.find(t => t.id === taskData.id);
      if (existing) {
        storageService.updateTask({
          ...existing,
          ...taskData,
        });
        showToast('تغییرات ماموریت ذخیره شد', undefined, 'save', 'success');
      }
    } else {
      // Creating
      storageService.createTask(taskData);
      showToast('ماموریت جدید ثبت گردید', `+${taskData.xp} XP پاداش تکمیل`, 'add_task', 'success');
    }
    setTasks(storageService.getTasks());
  };

  const handleDeleteTask = (id: string) => {
    storageService.deleteTask(id);
    setTasks(storageService.getTasks());
    showToast('ماموریت حذف گردید', undefined, 'delete', 'info');
  };

  // Habits Actions
  const handleToggleHabit = (id: string, dateKey?: string) => {
    const { habit, status, xpEarned } = storageService.toggleHabit(id, dateKey);
    if (!habit) return;

    setHabits(storageService.getHabits());
    setUser(storageService.getUser());

    if (status) {
      showToast(`عادت «${habit.title}» ثبت شد! ✨`, `+${xpEarned} XP برای استمرار زنجیره`, 'local_fire_department', 'xp');
    }
  };

  const handleCreateHabit = (
    newHabit: Omit<Habit, 'id' | 'currentStreak' | 'history'>
  ) => {
    storageService.createHabit(newHabit);
    setHabits(storageService.getHabits());
    showToast(`عادت «${newHabit.title}» به ماتریس اضافه شد`, undefined, 'auto_awesome', 'success');
  };

  const handleDeleteHabit = (id: string) => {
    storageService.deleteHabit(id);
    setHabits(storageService.getHabits());
    showToast('عادت حذف شد', undefined, 'delete', 'info');
  };

  // Focus Sprint Completion
  const handleCompleteSprint = (minutes: number, earnedXp: number) => {
    const updatedUser = {
      ...user,
      focusMinutesTotal: user.focusMinutesTotal + minutes,
    };
    storageService.saveUser(updatedUser);
    storageService.addXp(earnedXp);

    setUser(storageService.getUser());
    setIsDeepFocusOpen(false);
    showToast('اسپرینت تمرکز عمیق با موفقیت به پایان رسید!', `+${earnedXp} XP پاداش تمرکز عالی 🎧`, 'graphic_eq', 'reward');
  };

  // Claim Weekly Chest
  const handleClaimWeeklyChest = () => {
    const { xp, achievementTitle } = storageService.claimWeeklyChest();
    setUser(storageService.getUser());
    setAchievements(storageService.getAchievements());
    showToast(
      `پاداش هفتگی آزاد شد! +${xp} XP 🎉`,
      `تبریک! شما موفق به کسب ${achievementTitle} شدید`,
      'military_tech',
      'reward'
    );
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-[#0a0e17] text-[#dfe2ef] min-h-screen flex flex-col font-vazir antialiased selection:bg-[#00f2fe] selection:text-[#090d16]">
      {/* Fixed Header */}
      <Header
        user={user}
        activeTab={activeTab}
        unreadNotifsCount={unreadNotifsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1 w-full pt-16 pb-24 sm:pb-28">
        {activeTab === 'today' && (
          <TodayScreen
            user={user}
            tasks={tasks}
            habits={habits}
            onToggleTask={handleToggleTask}
            onToggleHabit={handleToggleHabit}
            onOpenDeepFocus={() => setIsDeepFocusOpen(true)}
            onOpenTaskModal={task => {
              setEditingTask(task || null);
              setIsTaskModalOpen(true);
            }}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksScreen
            tasks={tasks}
            user={user}
            onToggleTask={handleToggleTask}
            onQuickAdd={handleQuickAdd}
            onOpenTaskModal={task => {
              setEditingTask(task || null);
              setIsTaskModalOpen(true);
            }}
            onOpenRewardChest={() => setIsRewardChestOpen(true)}
          />
        )}

        {activeTab === 'habits' && (
          <HabitsScreen
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onCreateHabit={handleCreateHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        )}

        {activeTab === 'smart' && (
          <SmartAssistantScreen
            user={user}
            tasks={tasks}
            onAddGeneratedTask={task => {
              storageService.createTask(task);
              setTasks(storageService.getTasks());
              showToast('ماموریت هوشمند به لیست شما اضافه شد ✨', undefined, 'add_task', 'success');
            }}
            onOpenDeepFocus={() => setIsDeepFocusOpen(true)}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Dock */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
      />

      {/* Floating Interactive Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Deep Focus Timer Modal */}
      <DeepFocusModal
        isOpen={isDeepFocusOpen}
        onClose={() => setIsDeepFocusOpen(false)}
        onCompleteSprint={handleCompleteSprint}
      />

      {/* Weekly Reward Chest Modal */}
      <RewardChestModal
        isOpen={isRewardChestOpen}
        onClose={() => setIsRewardChestOpen(false)}
        achievements={achievements}
        onClaimWeeklyChest={handleClaimWeeklyChest}
      />

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        taskToEdit={editingTask}
        onSave={handleSaveTaskModal}
        onDelete={handleDeleteTask}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          storageService.markAllNotificationsRead();
          setNotifications(storageService.getNotifications());
        }}
      />

      {/* Profile & Data Ownership Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdateUser={updatedUser => setUser(updatedUser)}
        onDataReset={refreshAllData}
      />
    </div>
  );
}
