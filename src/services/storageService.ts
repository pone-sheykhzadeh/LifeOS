import { Task, Habit, UserProfile, Achievement, NotificationItem } from '../types';

const STORAGE_KEYS = {
  USER: 'lifeos_user_v1',
  TASKS: 'lifeos_tasks_v1',
  HABITS: 'lifeos_habits_v1',
  ACHIEVEMENTS: 'lifeos_achievements_v1',
  NOTIFICATIONS: 'lifeos_notifications_v1',
  FOCUS_STATS: 'lifeos_focus_stats_v1',
};

// Initial state synchronized with Stitch mockup screens
const DEFAULT_USER: UserProfile = {
  id: 'usr_sahar_1',
  name: 'سحر رضایی',
  avatarUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1U_F2u3f-3SiIfl1rg0DmSzzdgP6jF9Km7fBu4duKEfHnYekiu1W00IYrxqpGqYGku4aM9d3RV_kNMlJHg-mWVQFn9HCimonN1RhWlZtHZjMSvXPcjUs1VO-Io_t6vUDD5V7PSVU3YgAQf5i3wulHniWwID47QEECka7Vubuac5SRFAOObfqyfG0_07QtDa48SEpxiE1WEecM0gpbI9P2NZwb4wAZLcCwdt2mvXOAmo54tl0ECBlca_18',
  roleTitle: 'کاپیتان تمرکز',
  level: 7,
  currentXp: 1240,
  nextLevelXp: 1500,
  streakDays: 12,
  completedTasksCount: 4,
  focusMinutesTotal: 175,
  boostMultiplier: 3,
};

const DEFAULT_TASKS: Task[] = [
  // 1. فوری و بحرانی
  {
    id: 'task-crit-1',
    title: 'طراحی دیزاین سیستم دارک LifeOS',
    category: 'critical',
    priorityLabel: 'اولویت بحرانی 🔥',
    timeLabel: 'امروز ساعت ۱۵:۰۰',
    contextNote: 'نیازمند تمرکز عمیق',
    xp: 200,
    completed: false,
    isEpic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-crit-2',
    title: 'ارائه طرح نهایی رابط کاربری به مدیر محصول',
    category: 'critical',
    priorityLabel: 'اولویت بالا P1',
    timeLabel: '۱۰:۳۰ صبح',
    contextNote: 'بررسی پروتوتایپ فیگما و فیدبک تیم فنی LifeOS',
    xp: 150,
    completed: false,
    isEpic: true,
    createdAt: new Date().toISOString(),
  },
  // 2. پروژه‌ها و توسعه فنی
  {
    id: 'task-tech-1',
    title: 'پیاده‌سازی کلاستر کوبرنتیز و کانفیگ Envoy',
    category: 'tech',
    priorityLabel: 'معماری ابری Go',
    timeLabel: 'تحویل تا فردا',
    contextNote: 'کانفیگ لود بالانسر و تست مسیرهای میکروسرویس',
    xp: 150,
    completed: false,
    progressPercent: 65,
    isEpic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-tech-2',
    title: 'بررسی هزینه‌های سرور ابری و بهینه‌سازی دیتابیس',
    category: 'tech',
    priorityLabel: 'توسعه فنی',
    timeLabel: 'تکمیل در زمان هدف',
    contextNote: 'کاهش ۱۵ درصدی هزینه کلاسترها',
    xp: 100,
    completed: true,
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  // 3. رشد فردی و یادگیری
  {
    id: 'task-growth-1',
    title: 'مطالعه ۲۰ صفحه از کتاب «طراحی سیستم‌های مقیاس‌پذیر»',
    category: 'growth',
    priorityLabel: 'عادت عصرگاهی',
    timeLabel: 'فصل ۴: کشینگ و پارتیشن‌بندی',
    contextNote: 'مطالعه تکنیک‌های توزیع‌شده',
    xp: 120,
    completed: false,
    isEpic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-growth-2',
    title: 'برنامه‌ریزی سفر تفریحی آخر هفته به شمال 🏕️🌲',
    category: 'growth',
    priorityLabel: 'ریکاوری ذهن',
    timeLabel: 'پنج‌شنبه ساعت ۱۷:۰۰',
    contextNote: 'رزرو اقامتگاه و چک لیست وسایل سفر',
    xp: 80,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  // 4. سلامتی و توازن زیستی
  {
    id: 'task-health-1',
    title: 'تمرین هوازی و بدنسازی ۴۵ دقیقه',
    category: 'health',
    priorityLabel: 'برنامه باشگاه',
    timeLabel: 'ساعت ۱۸:۳۰ • باشگاه',
    contextNote: 'هدف ۵۰۰ کالری و تمرینات بالاتنه',
    xp: 90,
    completed: false,
    isEpic: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-health-2',
    title: 'نوشیدن ۲.۵ لیتر آب روزانه و ۱۵ دقیقه مدیتیشن صبحگاهی',
    category: 'health',
    priorityLabel: 'روتین صبحگاهی پایدار',
    timeLabel: 'صبحگاه',
    contextNote: 'تنفس عمیق و هیدراتاسیون',
    xp: 50,
    completed: true,
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_HABITS: Habit[] = [
  {
    id: 'habit-1',
    title: 'مدیتیشن صبحگاهی',
    category: 'health',
    icon: 'self_improvement',
    targetCount: 7,
    currentStreak: 12,
    color: '#00f2fe',
    history: {
      [new Date().toISOString().split('T')[0]]: true,
    },
  },
  {
    id: 'habit-2',
    title: 'ورزش روزانه',
    category: 'health',
    icon: 'fitness_center',
    targetCount: 5,
    currentStreak: 12,
    color: '#10b981',
    history: {
      [new Date().toISOString().split('T')[0]]: true,
    },
  },
  {
    id: 'habit-3',
    title: '۲ لیتر آب سالم',
    category: 'health',
    icon: 'water_drop',
    targetCount: 7,
    currentStreak: 12,
    color: '#06b6d4',
    history: {
      [new Date().toISOString().split('T')[0]]: true,
    },
  },
  {
    id: 'habit-4',
    title: '۲۰ صفحه مطالعه',
    category: 'growth',
    icon: 'menu_book',
    targetCount: 7,
    currentStreak: 11,
    color: '#a855f7',
    history: {
      [new Date().toISOString().split('T')[0]]: false,
    },
  },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-legendary-explorer',
    title: 'نشان «کاوشگر افسانه‌ای»',
    description: 'تکمیل تمامی ماموریت‌های هفتگی بدون وقفه',
    icon: 'military_tech',
    unlocked: false,
    xpReward: 500,
    progress: 4,
    maxProgress: 7,
  },
  {
    id: 'ach-deep-focus',
    title: 'ارباب تمرکز عمیق (Deep Focus Master)',
    description: 'تکمیل ۵ اسپرینت تمرکز ۲۵ دقیقه‌ای بدون حواس‌پرتی',
    icon: 'graphic_eq',
    unlocked: true,
    unlockedAt: 'دیروز',
    xpReward: 250,
    progress: 5,
    maxProgress: 5,
  },
  {
    id: 'ach-streak-flame',
    title: '۱۲ روز پیاپی آتشین 🔥',
    description: 'حفظ استمرار در عادات کلیدی برای بیش از ۱۰ روز',
    icon: 'local_fire_department',
    unlocked: true,
    unlockedAt: 'امروز',
    xpReward: 300,
    progress: 12,
    maxProgress: 12,
  },
  {
    id: 'ach-tech-guru',
    title: 'معمار کدهای تمیز',
    description: 'اتمام موفق ماموریت‌های پروژه‌ای و کانفیگ زیرساخت',
    icon: 'terminal',
    unlocked: false,
    xpReward: 350,
    progress: 2,
    maxProgress: 3,
  },
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'بوست ۳X فعال شد! ⚡',
    description: 'امتیاز کلیه ماموریت‌های امروز با ضریب سه محاسبه می‌شود.',
    timestamp: '۱۰ دقیقه پیش',
    read: false,
    type: 'streak',
  },
  {
    id: 'notif-2',
    title: 'پاداش هفتگی نزدیک است 🎁',
    description: 'تنها ۳ ماموریت دیگر تا بازگشایی صندوقچه پاداش هفتگی.',
    timestamp: '۱ ساعت پیش',
    read: false,
    type: 'achievement',
  },
  {
    id: 'notif-3',
    title: 'یادآور اسپرینت تمرکز',
    description: 'زمان اسپرینت تمرکز عمیق عصرگاهی برای پروژه کوبرنتیز.',
    timestamp: '۳ ساعت پیش',
    read: true,
    type: 'system',
  },
];

class StorageService {
  // USER
  getUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  }

  saveUser(user: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  addXp(amount: number): UserProfile {
    const user = this.getUser();
    let newXp = user.currentXp + amount;
    let newLevel = user.level;
    let nextXp = user.nextLevelXp;

    while (newXp >= nextXp) {
      newXp -= nextXp;
      newLevel += 1;
      nextXp = Math.round(nextXp * 1.25);
    }

    const updatedUser = {
      ...user,
      level: newLevel,
      currentXp: newXp,
      nextLevelXp: nextXp,
    };
    this.saveUser(updatedUser);
    return updatedUser;
  }

  // TASKS
  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  }

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }

  createTask(task: Omit<Task, 'id' | 'createdAt' | 'completed'>): Task {
    const tasks = this.getTasks();
    const newTask: Task = {
      ...task,
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    tasks.unshift(newTask);
    this.saveTasks(tasks);
    return newTask;
  }

  updateTask(updatedTask: Task): void {
    const tasks = this.getTasks().map(t => (t.id === updatedTask.id ? updatedTask : t));
    this.saveTasks(tasks);
  }

  deleteTask(id: string): void {
    const tasks = this.getTasks().filter(t => t.id !== id);
    this.saveTasks(tasks);
  }

  toggleTask(id: string): { task: Task | undefined; xpEarned: number } {
    const tasks = this.getTasks();
    let xpEarned = 0;
    let updatedTarget: Task | undefined;

    const newTasks = tasks.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        xpEarned = nextState ? t.xp : -t.xp;
        updatedTarget = {
          ...t,
          completed: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined,
        };
        return updatedTarget;
      }
      return t;
    });

    this.saveTasks(newTasks);

    if (xpEarned !== 0) {
      this.addXp(xpEarned);
    }

    return { task: updatedTarget, xpEarned };
  }

  // HABITS
  getHabits(): Habit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HABITS);
      return data ? JSON.parse(data) : DEFAULT_HABITS;
    } catch {
      return DEFAULT_HABITS;
    }
  }

  saveHabits(habits: Habit[]): void {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }

  toggleHabit(id: string, dateKey?: string): { habit: Habit | undefined; status: boolean; xpEarned: number } {
    const today = dateKey || new Date().toISOString().split('T')[0];
    const habits = this.getHabits();
    let xpEarned = 0;
    let targetHabit: Habit | undefined;
    let finalStatus = false;

    const updated = habits.map(h => {
      if (h.id === id) {
        const current = !!h.history[today];
        const nextStatus = !current;
        finalStatus = nextStatus;
        xpEarned = nextStatus ? 30 : -30;
        targetHabit = {
          ...h,
          currentStreak: nextStatus ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1),
          history: {
            ...h.history,
            [today]: nextStatus,
          },
        };
        return targetHabit;
      }
      return h;
    });

    this.saveHabits(updated);
    if (xpEarned > 0) {
      this.addXp(xpEarned);
    }
    return { habit: targetHabit, status: finalStatus, xpEarned };
  }

  createHabit(newHabit: Omit<Habit, 'id' | 'currentStreak' | 'history'>): Habit {
    const habits = this.getHabits();
    const habit: Habit = {
      ...newHabit,
      id: 'habit_' + Date.now(),
      currentStreak: 0,
      history: {},
    };
    habits.push(habit);
    this.saveHabits(habits);
    return habit;
  }

  deleteHabit(id: string): void {
    const habits = this.getHabits().filter(h => h.id !== id);
    this.saveHabits(habits);
  }

  // ACHIEVEMENTS
  getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : DEFAULT_ACHIEVEMENTS;
    } catch {
      return DEFAULT_ACHIEVEMENTS;
    }
  }

  saveAchievements(achs: Achievement[]): void {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achs));
  }

  claimWeeklyChest(): { xp: number; achievementTitle: string } {
    const achs = this.getAchievements();
    const updated = achs.map(a => {
      if (a.id === 'ach-legendary-explorer') {
        return { ...a, unlocked: true, unlockedAt: 'همین الان' };
      }
      return a;
    });
    this.saveAchievements(updated);
    this.addXp(500);
    return { xp: 500, achievementTitle: 'نشان «کاوشگر افسانه‌ای»' };
  }

  // NOTIFICATIONS
  getNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  }

  markAllNotificationsRead(): void {
    const notifs = this.getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }

  // DATA OWNERSHIP: EXPORT & IMPORT
  exportBackup(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user: this.getUser(),
      tasks: this.getTasks(),
      habits: this.getHabits(),
      achievements: this.getAchievements(),
      notifications: this.getNotifications(),
    };
    return JSON.stringify(data, null, 2);
  }

  importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.user) this.saveUser(parsed.user);
      if (parsed.tasks) this.saveTasks(parsed.tasks);
      if (parsed.habits) this.saveHabits(parsed.habits);
      if (parsed.achievements) this.saveAchievements(parsed.achievements);
      return true;
    } catch (e) {
      console.error('Import error', e);
      return false;
    }
  }

  resetAll(): void {
    localStorage.clear();
  }
}

export const storageService = new StorageService();
